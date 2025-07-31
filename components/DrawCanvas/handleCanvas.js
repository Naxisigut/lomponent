/** @生成海报 - 新版Canvas **/
export function createPoster2D(canvasInfo, options, callback) {
  uni.showLoading({
    title: '海报生成中…',
    mask: true
  })

  // this为canvas组件实例
  this.createSelectorQuery()
    .select('#' + canvasInfo.id)
    .node()
    .exec((res) => {
      console.log('createSelectorQuery', res);
      const canvas = res[0].node;
      const ctx = canvas.getContext('2d');
      
      // 设置canvas尺寸
      const dpr = uni.getSystemInfoSync().pixelRatio || 1;
      console.log('dpr', dpr);
      canvas.width = canvasInfo.width * dpr;
      canvas.height = canvasInfo.height * dpr;
      ctx.scale(dpr, dpr);
      
      var index = 0
      drawCanvas2D(ctx, canvas, canvasInfo, options, index, () => {
        // 新版Canvas不需要draw()，绘制是实时的
        const timer = setTimeout(() => {
          savePoster2D.call(this, canvas, callback)
          clearTimeout(timer)
        }, 100) // 新版Canvas延迟时间可以更短
      })
    });
}

// 绘制中 - 新版Canvas
async function drawCanvas2D(ctx, canvas, canvasInfo, options, index, drawComplete) {
  let item = options[index]
  // 最大行数：maxLine  字体大小：fontSize  行高：lineHeight
  //    类型    颜色  left  right  top  bottom   宽      高     圆角    图片  文本内容
  let { type, color, left, right, top, bottom, width, height, radius, url, content, fontSize } = item
  radius = radius || 0
  const { width: canvasWidth, height: canvasHeight } = canvasInfo
  
  switch (type) {
    /** @文本 **/
    case 'text':
      if (!content) break
      // 设置字体
      ctx.font = `${fontSize}px sans-serif`
      // 内容宽度：传了宽度就去宽度，否则取字体本身宽度
      item.width = width || ctx.measureText(content).width
      // left位置
      if (right !== undefined) {
        item.left = canvasWidth - right - item.width
      } else if (left === 'center') {
        item.left = canvasWidth / 2 - item.width / 2
      }

      // top位置
      if (bottom !== undefined) {
        item.top = canvasHeight - bottom - fontSize
      }
      
      drawText2D(ctx, item)
      break
    /** @图片 **/
    case 'image':
      if (!url) break
      var imageObj = await getImageTempPath2D(url, canvas)
      // left位置
      if (right !== undefined) {
        left = canvasWidth - right - width
      } else if (left === 'center') {
        left = canvasWidth / 2 - width / 2
      }

      // top位置
      if (bottom !== undefined) {
        top = canvasHeight - bottom - height
      }

      // 带圆角
      if (radius) {
        ctx.save()
        ctx.beginPath()
        // 圆形图片
        if (radius === '50%') {
          ctx.arc(left + width / 2, top + height / 2, width / 2, 0, Math.PI * 2, false)
        } else {
          if (width < 2 * radius) radius = width / 2
          if (height < 2 * radius) radius = height / 2
          ctx.beginPath()
          ctx.moveTo(left + radius, top)
          ctx.arcTo(left + width, top, left + width, top + height, radius)
          ctx.arcTo(left + width, top + height, left, top + height, radius)
          ctx.arcTo(left, top + height, left, top, radius)
          ctx.arcTo(left, top, left + width, top, radius)
          ctx.closePath()
        }
        ctx.clip()
      }
      ctx.drawImage(imageObj, left, top, width, height)
      ctx.restore()

      break
    /** @盒子 **/
    case 'block':
      // left位置
      if (right !== undefined) {
        left = canvasWidth - right - width
      } else if (left === 'center') {
        left = canvasWidth / 2 - width / 2
      }

      // top位置
      if (bottom !== undefined) {
        top = canvasHeight - bottom - height
      }
      if (width < 2 * radius) {
        radius = width / 2
      }
      if (height < 2 * radius) {
        radius = height / 2
      }
      ctx.beginPath()
      ctx.fillStyle = color
      ctx.strokeStyle = color
      ctx.moveTo(left + radius, top)
      ctx.arcTo(left + width, top, left + width, top + height, radius)
      ctx.arcTo(left + width, top + height, left, top + height, radius)
      ctx.arcTo(left, top + height, left, top, radius)
      ctx.arcTo(left, top, left + width, top, radius)
      ctx.stroke()
      ctx.fill()
      ctx.closePath()
      break
    /** @边框 **/
    case 'border':
      // left位置
      if (right !== undefined) {
        left = canvasWidth - right - width
      }

      // top位置
      if (bottom !== undefined) {
        top = canvasHeight - bottom - height
      }
      ctx.beginPath()
      ctx.moveTo(left, top)
      ctx.lineTo(left + width, top + height)
      ctx.strokeStyle = color
      ctx.lineWidth = width
      ctx.stroke()
      break
  }

  // 递归边解析图片边画
  if (index === options.length - 1) {
    drawComplete()
  } else {
    index++
    drawCanvas2D(ctx, canvas, canvasInfo, options, index, drawComplete)
  }
}

// 下载并保存 - 新版Canvas
function savePoster2D(canvas, callback) {
  uni.showLoading({
    title: '保存中…',
    mask: true
  })
  function success(res) {
    console.log(33333);
    callback && callback(res.tempFilePath)
    uni.saveImageToPhotosAlbum({
      filePath: res.tempFilePath,
      success() {
        uni.showToast({
          icon: 'success',
          title: '保存成功！'
        })
      },
      fail() {
        uni.showToast({
          icon: 'none',
          title: '保存失败，请稍后再试~'
        })
      },
      complete() {
        uni.hideLoading()
      }
    })
  }
  function fail(res) {
    console.log('图片保存失败：', res.errMsg)
    uni.showToast({
      icon: 'none',
      title: '保存失败，请稍后再试~'
    })
  }
  // #ifdef MP-WEIXIN
  wx.canvasToTempFilePath({
    canvas,
    success,
    fail
  })
  // #endif
  
  // #ifdef MP-ALIPAY
  canvas.toTempFilePath({
    success,
    fail
  })
  // #endif
}

// 绘制文字（带换行超出省略…功能）
function drawText2D(ctx, item) {
  let { content, width, maxLine, left, top, lineHeight, color, fontSize } = item
  content = String(content)
  lineHeight = (lineHeight || 1.3) * fontSize

  ctx.font = `${fontSize}px sans-serif` // 字体
  ctx.fillStyle = color // 颜色

  // 文本处理
  let strArr = content.split('')
  let row = []
  let temp = ''
  for (let i = 0; i < strArr.length; i++) {
    if (ctx.measureText(temp).width < width) {
      temp += strArr[i]
    } else {
      i-- //这里添加了i-- 是为了防止字符丢失，效果图中有对比
      row.push(temp)
      temp = ''
    }
  }
  row.push(temp) // row有多少项则就有多少行

  //如果数组长度大于2，现在只需要显示两行则只截取前两项,把第二行结尾设置成'...'
  if (row.length > maxLine) {
    let rowCut = row.slice(0, maxLine)
    let rowPart = rowCut[1]
    let text = ''
    let empty = []
    for (let i = 0; i < rowPart.length; i++) {
      if (ctx.measureText(text).width < width) {
        text += rowPart[i]
      } else {
        break
      }
    }
    empty.push(text)
    let group = empty[0] + '...' //这里只显示两行，超出的用...表示
    rowCut.splice(1, 1, group)
    row = rowCut
  }
  // 把文本绘制到画布中
  for (let i = 0; i < row.length; i++) {
    // 一次渲染一行
    ctx.fillText(row[i], left, top + i * lineHeight, width)
  }
}

// 获取图片信息 - 新版Canvas
function getImageTempPath2D(url, canvas) {
  return new Promise((resolve) => {
    // base64图片
    if (url.includes('base64')) {
      base64Save(url).then((src) => {
        const img = canvas.createImage()
        img.onload = () => resolve(img)
        img.onerror = () => {
          console.log('base64图片加载失败');
          uni.showToast({
            icon: 'none',
            title: '图片加载失败'
          })
        }
        img.src = src
      })
      return
    }

    // 本地图片和网络图片
    // 新版Canvas创建Image对象
    const img = canvas.createImage()
    img.onload = () => resolve(img)
    img.onerror = () => {
      console.log('图片加载失败:', url);
      uni.showToast({
        icon: 'none',
        title: '图片加载失败'
      })
    }
    img.src = url
  })
}

function base64Save(base64File) {
  //base64File 需要加前缀
  const fsm = uni.getFileSystemManager() //获取全局文件管理器
  let extName = base64File.match(/data:\S+\/(\S+);/)
  if (extName) {
    //获取文件后缀
    extName = extName[1]
  }
  //获取自1970到现在的毫秒 + 文件后缀 生成文件名
  let fileName = Date.now() + '.' + extName
  return new Promise((resolve, reject) => {
    //写入文件的路径
    const filePath = uni.env.USER_DATA_PATH + '/' + fileName
    fsm.writeFile({
      filePath,
      data: base64File.replace(/^data:\S+\/\S+;base64,/, ''), //替换前缀为空
      encoding: 'base64',
      success: () => {
        resolve(filePath)
      },
      fail() {
        reject('写入失败')
      }
    })
  })
}

// 用于计算字符串实际长度，中文单个字符长度为1，英文和数字单个字符长度为0.5
export const getStrLength = (data) => {
  data = String(data)
  let length = 0
  for (let i = 0; i < data.length; i++) {
    length += data.charCodeAt(i) > 128 ? 1 : 0.5
  }
  return length
}
