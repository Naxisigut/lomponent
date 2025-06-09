## 简介
自定义图片预览指令，点击使用的元素时预览指定的图片。
注意传给指令的值在mounted时就要有效，不会响应式更新
#### 全局注册
```js
// main.js 全局注册
import { preview } from  "./imgPreview"
app.directive('preview', preview);
```

```html
<!-- app.vue template 在布局中添加一个img-viewer供全局调用 -->
 <template>
  <el-config-provider :locale="currentLocale">
    <router-view />
    <el-image-viewer 
      v-if="previewProps.visible" 
      :url-list="previewProps.srcList" 
      @close="previewProps.visible = false"
    />
  </el-config-provider>
</template>

```
```js
// app.vue script
import { previewProps } from "@/directives/imgPreview";
export default defineComponent({
  name: "app",
  computed: {
    previewProps() {
      return previewProps
    }
  }
});
```
#### 在组件中调用
```html
<el-image
  v-if="row.headImg"
  :src="row.headImg"
  fit="cover"
  class="w-8 h-8 rounded"
  v-preview="row.headImg"
/>

```

## 平台与兼容性
web

## 技术栈
vue3 element-plus


