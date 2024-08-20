// index.js
Page({
  data: {
    region: ['山东省',' 青岛市',' 黄岛区'],
    locationId: '',
    now: {
      temp: 0,
      text: "未知",
      icon: "999",
      humidity: 0,
      pressure: 0,
      vis:0,
      windDir: 0,
      windScale: 0,
      windSpeed: 0
    }
  },

  regionChange: function(e){
    this.setData({region: e.detail.value});
    this.getNow();
  },

  getNow: function () {
    var that = this;
    wx.request({
      url: 'https://geoapi.qweather.com/v2/city/lookup?',
      data:{
        location:that.data.region[1],
        key: 'e930091cdf5d41f59f28a6387d3b182f'
      },
      success: function (res) {
        console.log("location获取",res.data.location[0].id);
        if (res.data.code === "200" && res.data.location.length > 0) {
          that.setData({
            locationId: res.data.location[0].id
          });
          that.getWeather();
        }else{
          console.log("请求失败");
        }
      }
    })
  },
  getWeather: function(){
    var that = this;
    wx.request({
      url: 'https://devapi.qweather.com/v7/weather/now?',
      data:{
        location: that.data.locationId,
        key: 'e930091cdf5d41f59f28a6387d3b182f'
      },
      success: function (res) {
        console.log(res.data);
        that.setData({now: res.data.now});
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getNow();
  },

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