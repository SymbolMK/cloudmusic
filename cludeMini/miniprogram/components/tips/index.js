// components/tips/index.js
Component({
  externalClasses: ['icon-gary','iconfont'],
  properties: {

  },
  options: {
    multipleSlots: true
  },

  data: {
    isActive: false
  },

  ready() {
    this.setData({
      isActive: true
    })
  },

  methods: {
    stop() {
      return false
    },
    closeTip(){
      this.triggerEvent('closeTip')
    }
  }
})
