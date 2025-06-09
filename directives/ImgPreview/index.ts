import { reactive } from 'vue';

export const previewProps = reactive({
  visible: false,
  srcList: []
})
const onPreview = (url: string | string[]) => {
  previewProps.srcList = Array.isArray(url) ? url : [url]
  previewProps.visible = true
}

export const preview = {
  mounted(el, binding) {
    const handler = () => {
      const currentValue = el._currentBindingValue
      onPreview(currentValue)
    }
    el._currentBindingValue = binding.value
    el._handler = handler
    el.addEventListener("click", handler)
  },
  updated(el, binding) {
    el._currentBindingValue = binding.value
  },
  beforeUnmount(el) {
    el.removeEventListener("click", el?._handler)
    delete el._currentBindingValue
    delete el._handler
  }
}
