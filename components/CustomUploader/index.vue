<template>
  <el-upload
    ref="uploader"
    class="uploader"
    action="recycle-admin/ossController/doUpLoad"
    v-bind="vBindProps"
    v-model:file-list="uploadFileList"
    :show-file-list="true"
    :multiple="multiple" 
    :auto-upload="autoUpload"
    :before-upload="onBeforeUpload"
    :on-success="onUploadSuccess"
    :on-error="onUploadError"
    :on-remove="onRemove"
    :on-preview="onPreview"
    :on-exceed="onExceed"
  >
    <template #default>
      <el-icon class="uploader-icon"><Plus /></el-icon>
    </template>
  </el-upload>
  <!-- 图片预览 -->
  <el-image-viewer v-if="showPreview" teleported :url-list="fileUrls" @close="showPreview = false" />
</template>

<script lang='ts' setup>
import { ref, useTemplateRef, watch, computed, onMounted, onUnmounted } from 'vue';
import { Plus } from '@element-plus/icons-vue'
import decryptData from '@/utils/http/decrypt';
import { message } from '@/utils/message';
import type { UploadProps, UploadFile, UploadRawFile } from 'element-plus';
import { genFileId } from 'element-plus';
import Compressor from 'compressorjs';
import Sortable from 'sortablejs';

interface Props {
  fileType?: string
  uploaderType?: 'img' | 'file'
  autoUpload?: boolean
  multiple?: boolean
  sizeLimit?: number
  isEncrypt?: boolean
  numLimit?: number | string
  cardSize?: number
  isSortable?: boolean
}
const { 
  fileType = '2',  // 1-word文档 2-商品图片 4-首页配置 5-订单图片，订单PDF 6-excel文件
  uploaderType = 'img',
  autoUpload = true,
  multiple = false,
  sizeLimit = 4,
  isEncrypt = true,
  numLimit = 10,
  cardSize = 100,
  isSortable = false
} = defineProps<Props>()
const vBindProps = computed<Partial<UploadProps>>(() => {
  const limit = multiple ? Number(numLimit) : 1;
  return {
    data: { fileType },
    listType: uploaderType === 'img' ? 'picture-card' : 'text',
    limit,
    style: { '--card-size': cardSize + 'px' },
    class: { 'no-upload': uploadFileList.value.length >= limit }
  }
})

const emit = defineEmits<{
  'onRemove': [file: UploadFile, files: UploadFile[]]
}>()

const uploader = useTemplateRef('uploader')
const model = defineModel<string>()
const uploadFileList = ref<UploadFile[]>([])

const fileUrls = computed(() => {
  return uploadFileList.value.map(item => item.url)
})
watch(uploadFileList, () => {
  const urls = uploadFileList.value.map(item => item.url)
  model.value = urls.join(',')
  // 仅在多选且可排序且当前文件列表大于1时，设置拖拽排序
  if(isSortable && multiple){
    if(uploadFileList.value.length > 1){
      sortable?.option('disabled', false)
    }else{
      sortable?.option('disabled', true)
    }
  }
}, { deep: true })
// 监听 model 变化，实现回显功能
watch(model, (newVal, oldVal) => {
  console.log('prevent recursive call');
  if(oldVal === void 0 && newVal === '') return // 初始化且外部组件没有初始值时，不进行回显
  if (typeof newVal !== 'string') { // 赋值错误
    uploadFileList.value = []
    message('赋值错误，请检查！', { type: 'error' })
    return
  }

  const urls = newVal.split(',').filter(Boolean)
  if (urls.length === 0) { // 外部组件清空
    uploadFileList.value = []
    model.value = ''
    return
  }

  let needUpdate = false
  if(urls.length !== uploadFileList.value.length){
    needUpdate = true
  }else{
    for(let i = 0; i < urls.length; i++){
      const url = urls[i]
      const file = uploadFileList.value[i]
      if(!file || file.url !== url){
        needUpdate = true
        break
      }
    }
  }
  if(!needUpdate)return // 外部赋值未产生需要回显的变化

  // 将已有的 url 转换为 UploadFile 对象
  const limit = multiple ? Number(numLimit) : 1;
  if(urls.length > limit){
    urls.splice(limit) // 超出限制，截取前 limit 个
  }
  uploadFileList.value = urls.map(url => ({
    name: url.split('/').pop() || '',
    url: url,
    status: 'success',
    uid: genFileId()
  }))
}, { immediate: true })

/* 上传前钩子：数量超出处理 */
const onExceed: UploadProps['onExceed'] = (files) => {
  if(!multiple){
    // 单个文件 覆盖上一个文件
    uploader.value!.clearFiles()
    const file = files[0] as UploadRawFile
    file.uid = genFileId()
    uploader.value!.handleStart(file)
  }else {
    message(`最多只能上传${numLimit}张图片`, { type: 'error' })
  }
}

/* 上传前钩子：压缩 size验证 */
function checkSize(file: File){
  if(sizeLimit > 0 && (file.size > sizeLimit * 1024 * 1024)){
    message(`图片大小不能超过${sizeLimit}MB`, { type: 'error' });
    return false;
  }
  return true
}
function compress(rawFile: UploadRawFile){
  return new Promise<File>((resolve, reject) => {
    new Compressor(rawFile, {
      success(result: File) {
        // @ts-ignore
        result.uid = rawFile.uid;
        resolve(result);
      },
      error: () => resolve(rawFile)
    });
  });
}
const onBeforeUpload: UploadProps['beforeUpload'] = async (rawFile) => {
  const compressedFile = await compress(rawFile);
  if(!checkSize(compressedFile)){
    message(`图片大小不能超过${sizeLimit}MB`, { type: 'error' });
    return false;
  }
  return compressedFile;
};

/* 上传成功钩子 */
const onUploadSuccess: UploadProps['onSuccess'] = (res, file, fileList) => {
  try {
    if(res.success){
      // 上传成功，返回数据未经过拦截，故需要解密
      const url = isEncrypt ? decryptData(res.result) : res.result
      file.url = url
    }else{
      // 上传失败，删除文件
      fileList.splice(fileList.indexOf(file), 1)
      message(res.message, { type: 'error' })
    }
  } catch (error) {
    const msg = error.message || '处理图片出错，请稍后再试！'
    message(msg, { type: 'error' })
  }
}

/* 上传失败钩子 */
const onUploadError: UploadProps['onError'] = (err) => {
  // 上传请求失败
  // console.log('upload error', {err});
  const msg = err.message || '上传出错，请稍后再试！'
  message(msg, { type: 'error' })
}

/* 移除文件钩子 */
const onRemove: UploadProps['onRemove'] = (file, fileList) => {
  emit('onRemove', file, fileList)
}

/* 图片预览 */
const showPreview = ref(false)
const onPreview: UploadProps['onPreview'] = () => showPreview.value = true

/* 拖拽排序 */
let sortable:Sortable = null
const setSortable = () => {
  if (!uploader.value?.$el) return;
  const uploadList = uploader.value?.$el?.querySelector('.el-upload-list');

  sortable = new Sortable(uploadList, {
    draggable: '.el-upload-list__item',
    animation: 150,
    disabled: true,
    filter: ".el-icon,svg", // 点击预览和剪切的图标时不拖拽
    // handle: "*:not(.el-icon)"
    onEnd: function (/**Event*/evt) {
      const { newIndex, oldIndex } = evt;
      if (newIndex === oldIndex) return;
      // 剪切后插入
      const movedItem = uploadFileList.value.splice(oldIndex, 1)[0];
      uploadFileList.value.splice(newIndex, 0, movedItem);
    },
  });
}
onMounted(() => {
  if(isSortable) setSortable();
});
onUnmounted(() => {
  sortable?.destroy()
});

</script>

<style lang='scss' scoped>
@mixin uploaderSize() {
  &:deep(.el-upload-list--picture-card) {
    --el-upload-list-picture-card-size: var(--card-size);
    >*{
      background-color: transparent;
    }
  }
  &:deep(.el-upload--picture-card) {
    --el-upload-picture-card-size: var(--card-size);
  }
}


.uploader {
  @include uploaderSize;

  // 去除过渡动画
  &:deep(.el-upload-list__item) {
    transition: none;
    .el-icon--close-tip{
      display: none!important;
    }
  }
  &:deep(.el-upload-list--picture-card) {
    .el-progress {
      max-width: 100%;
      max-height: 100%;
      .el-progress-circle {
        max-width: 100%!important;
        max-height: 100%!important;
      }
    }
  }
  &.no-upload {
    &:deep(.el-upload--picture-card) {
      display: none;
    }
  }
}
</style>
