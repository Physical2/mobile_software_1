// const { userInfo } = require("os");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {
      avatarUrl: 'http://sjeui0ii0.hn-bkt.clouddn.com/avatar.png?e=1725659285&token=m_bn1L1AownGExdIcnOr0BKfra4R2MrZwS7fF3ue:Y8x7AypndjmLH9CrGXY311yq8oY=',
      nickName: '点击登录',
    },
    hasUserInfo: false,
    advice: '',
    isShowAbout: false
  },

  // onLoad(options) {
  // },

  showAbout: function () {
    this.setData({
      isShowAbout: true,
      animationClass: 'slide-in-elliptic-bottom-fwd'
    })
  },

  unShowAbout: function () {
    this.setData({
      isShowAbout: false,
      advice: ''
    })
  },

  onAdviceInput: function (e) {
    this.setData({
      advice: e.detail.value
    })
  },

  submitAdvice: function () {
    // const { adviceContent } = this.data.advice;
    // console.log("this.data.advice", this.data.advice);
    // console.log("调用submitAdvice");
    if (!this.data.advice || typeof this.data.advice !== 'string' || !this.data.advice.trim()) {
      wx.showToast({
        title: '貌似没有提什么建议哇~',
        icon: 'none'
      });
      return;
    }
    if(!this.data.hasUserInfo){
      wx.showToast({
        title: '好像还没登录诶',
        icon: 'none'
      });
      return;
    }
    wx.showLoading({
      title: '加载中...',
    });

  wx.cloud.callFunction({
    name: 'addAdvice',
    data: {
      adviceContent: this.data.advice,
      userInfo: this.data.userInfo  // 获取用户信息
    },
    
    success: res => {
      if (res.result.success) {
        console.log(this.data.advice, this.data.userInfo);
        wx.showToast({
          title: '建议收到啦！',
          icon: 'success'
        });
        this.setData({
          advice: '',  // 清空输入框内容
          isShowAbout: false 
        });
      } else {
        // wx.showToast({
        //   title: '提交失败，请重试',
        //   icon: 'none'
        // });
      }
    },
    fail: err => {
      console.error('调用云函数失败：', err);
      wx.showToast({
        title: '提交失败，请重试',
        icon: 'none'
      });
    },
    complete: () => {
      // 隐藏加载中样式
      wx.hideLoading();
    }
  });

  },

  getUserProfile: function(e){  
    if(this.data.hasUserInfo){
      wx.showToast({
        title: '您已经登录过啦~',
      })
      return;
    }
          wx.getUserProfile({
            desc: '获取头像和微信名',
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
  },

  // 获取微信用户信息的函数
  getUserInfo: function() {
    const that = this;

    // 如果已经有用户信息，提示已经登录
    if (this.data.hasUserInfo) {
      wx.showToast({
        title: '已经登录过啦',
        icon: 'none'
      });
      return;
    }
    // 获取用户信息
    wx.getUserProfile({
      desc: '获取用户信息以展示在页面中', // 提示用户授权
      success: (res) => {
        that.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        });
        wx.showToast({
          title: '登录成功',
          icon: 'success'
        });
      },
      fail: (err) => {
        wx.showToast({
          title: '用户拒绝授权',
          icon: 'none'
        });
      }
    });
   
        
              
  },


  /**
   * 生命周期函数--监听页面加载
   */
  

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})