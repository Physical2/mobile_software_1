Page({

  /**
   * 页面的初始数据
   */
  data: {
    todoList: []
  },

  onLoad: function (options) {
    this.getTodoList();
  },

  // onPullDownRefresh: function () {
  //   var that = this;
  //   if(that.todo){
  //     wx.stopPullDownRefresh();
  //     return 
  //   }

  //   this.getTodoList().then(res => {
  //     console.log("get到的内容",res)

      
  //   })

  //   that.setData({
  //     todo: {}
  //   })
  // },

  // 调用 getTodoList 云函数
  getTodoList: function () {
    wx.cloud.callFunction({
      name: 'getTodoList',
      success: res => {
        if (res.result.success) {
          this.setData({
            todoList: res.result.data
          })
          console.log("getTodoList返回数据",res.result.data )
        } else {
          console.error('Failed to get todo list:', res.result.errorMessage)
        }
      },
      fail: err => {
        console.error('Failed to call cloud function:', err)
      }
    })
  },

  onPullDownRefresh: function () {
    this.getTodoList();
    wx.stopPullDownRefresh();
  },

  

  /**
   * 生命周期函数--监听页面加载
   */
  
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})