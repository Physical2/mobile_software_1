// app.js
App({

  /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch: function () {
    const themeColor = wx.getStorageSync('themeColor');
    if (themeColor) {
      wx.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: themeColor,
        animation: {
          duration: 400,
          timingFunc: 'easeIn'
        }
      });
    }
    const tabBarConfig = wx.getStorageSync('tabBarConfig');
    if (tabBarConfig) {
      this.updateTabBarColor(tabBarConfig);
    }
  },

  updateTabBarColor(config) {
    wx.setTabBarStyle({
      backgroundColor: config.backgroundColor,
      color: config.color,
      selectedColor: config.selectedColor
    });
  },

  /**
   * 当小程序启动，或从后台进入前台显示，会触发 onShow
   */
  onShow: function (options) {
    
  },

  /**
   * 当小程序从前台进入后台，会触发 onHide
   */
  onHide: function () {
    
  },

  /**
   * 当小程序发生脚本错误，或者 api 调用失败时，会触发 onError 并带上错误信息
   */
  onError: function (msg) {
    
  }
})





// App({
//   onLaunch() {
//     // 展示本地存储能力
//     const logs = wx.getStorageSync('logs') || []
//     logs.unshift(Date.now())
//     wx.setStorageSync('logs', logs)

//     // 登录
//     wx.login({
//       success: res => {
//         // 发送 res.code 到后台换取 openId, sessionKey, unionId
//       }
//     })
//   },
//   globalData: {
//     userInfo: null
//   }
// })
