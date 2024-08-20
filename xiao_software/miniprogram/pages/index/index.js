const { envList } = require("../../envList");
const { QuickStartPoints, QuickStartSteps } = require("./constants");

Page({
  data: {
    knowledgePoints: QuickStartPoints,
    steps: QuickStartSteps,
    // src: '../../images/avatar.png',
    // name: 'Hello World',
    userInfo: {
      avatarUrl: '../../images/avatar.png',
      nickName: '匿名用户',
    },
    hasUserInfo: false,
  },

  copyCode(e) {
    const code = e.target?.dataset?.code || '';
    wx.setClipboardData({
      data: code,
      success: () => {
        wx.showToast({
          title: '已复制',
        })
      },
      fail: (err) => {
        console.error('复制失败-----', err);
      }
    })
  },

  discoverCloud() {
    wx.switchTab({
      url: '/pages/examples/index',
    })
  },

  gotoGoodsListPage() {
    wx.navigateTo({
      url: '/pages/goods-list/index',
    })
  },

  // getInfo: function(e){
  //   // console.log(e.detail.userInfo)
  //   console.log("打印", e.detail.userInfo);
  //   let info = e.detail.userInfo;
  //   this.setData({
  //     src: info.avatarUrl,
  //     name: info.nickName
  //   })
  // }
getUserProfile: function(e){
  wx.getUserProfile({
    desc: '用于完善用户信息',
    success: (result) => {
      console.log(result);
      this.setData({
        userInfo: result.userInfo,
        hasUserInfo: true,
      })
    },
    fail: () => {
      wx.showToast({
        title: '授权失败',
      });
      this.setData({
        hasUserInfo: true,
      })
    },
    complete: (res) => {},
  })
}
  
});
