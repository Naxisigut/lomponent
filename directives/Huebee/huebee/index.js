import Huebee from './huebee.pkgd.min.js'
export default {
  install (Vue) {
    Vue.prototype.$huebee = Huebee
    Vue.directive('huebee', {
      inserted: (el, binding, vnode)=>{
          var hueb = new Huebee(el, {
            // options
            notation: 'hex',
            saturations: 2,
          });
          hueb.on('change', (color, hue, sat, lum) => {
            el.value = color
            // 主动触发input事件
            const inputEvent = new Event('input', {
              bubbles: true,
              cancelable: true
            })
            el.dispatchEvent(inputEvent)
            
            // 主动触发change事件
            const changeEvent = new Event('change', {
              bubbles: true,
              cancelable: true
            })
            el.dispatchEvent(changeEvent)
          })
      }
    });
  }
}
