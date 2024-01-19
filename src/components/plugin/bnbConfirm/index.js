import Vue from 'vue'
import ConfirmComponent from './BnbInsufficientDialog.vue'

// 创建一个全局的弹窗构造函数
const PopupConstructor = Vue.extend(ConfirmComponent)

// 创建一个函数来打开弹窗，并接受参数和回调函数
export function openDialog(lang, onConfirmCallback) {
  // 创建弹窗实例，并传入参数和回调函数
  const instance = new PopupConstructor({
    propsData: {
      lang: lang,
      onConfirm: onConfirmCallback
    }
  }).$mount()
  document.body.appendChild(instance.$el)
}