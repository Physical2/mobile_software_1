// index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    timeArray: [],      // 用于存储年、月、日、时、分的数组
    timeIndex: [0, 0, 0, 0, 0],  // 用于存储当前选中的时间索引
    timeDisplay: '',    // 用于显示用户选择的时间
    isPickerEnabled:true, // 控制时间选择器是否启用

    categories: ['全部待办','学习', '生活', '工作', '娱乐'], // 分类列表
    currentCategory: '全部待办', // 当前展示的分类
    selectedIndex: 0, // 选中的分类索引
    category1Data: [
      { name: '数据1' },
      { name: '数据2' }
    ],
    currentDragIndex: null, // 当前拖拽的索引

    themeColor: '#FF5733',
    selectedColor: '#FF5733', // 默认颜色
    showPicker: false,
    colors: ['#FF5733', '#3498db', '#2ecc71', '#e74c3c', '#9b59b6', '#f39c12'] // 可选颜色
  },

  

  // // 处理按钮点击事件
  // changeThemeColor() {
  //   const newColor = '#3498db'; // 你可以根据实际需求设置新颜色
  //   this.setData({
  //     themeColor: newColor
  //   });
  //   this.updateNavigationBarColor(newColor);
  //   this.updateTabBarColor(newColor);
  //   wx.setStorageSync('themeColor', newColor); // 保存颜色到本地存储
  // },

  


  

  

  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.applyStoredThemeColor();
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();

    // 初始化年、月、日、小时、分钟数组
    const yearsArray = [year, year + 1];
    const monthsArray = [];
    const daysArray = [];
    const hoursArray = [];
    const minutesArray = [];
    for (let i = 1; i <= 12; i++) {
      monthsArray.push(i < 10 ? '0' + i : '' + i);
    }
    for (let i = 1; i <= this.getDaysInMonth(year, month); i++) {
      daysArray.push(i < 10 ? '0' + i : '' + i);
    }
    for (let i = 0; i < 24; i++) {
      hoursArray.push(i < 10 ? '0' + i : '' + i);
    }
    for (let i = 0; i < 60; i++) {
      minutesArray.push(i < 10 ? '0' + i : '' + i);
    }

    // 设置 picker 的时间数组
    this.setData({
      timeArray: [yearsArray, monthsArray, daysArray, hoursArray, minutesArray],
      timeIndex: [0, month - 1, day - 1, hours, minutes],
      timeDisplay: `${yearsArray[0]}-${monthsArray[month - 1]}-${daysArray[day - 1]} ${hoursArray[hours]}:${minutesArray[minutes]}`
    });

    const category1Data = wx.getStorageSync('category1Data') || [
      { name: '数据1' },
      { name: '数据2' }
    ];

    this.setData({
      category1Data
    });
  },

  showColorPicker() {
    this.setData({
      showPicker: !this.data.showPicker
    });
  },

  selectColor(e) {
    const newColor = e.currentTarget.dataset.color;
    this.setData({
      selectedColor: newColor,
      showPicker: false
    });
    this.updateNavigationBarColor(newColor);
    this.updateTabBarColor(newColor);
    wx.setStorageSync('themeColor', newColor); // 保存颜色到本地存储
  },

  // 处理时间变化
  bindTimeChange: function(e) {
    const selectedTime = e.detail.value;
    const selectedHours = this.data.timeArray[0][selectedTime[0]];
    const selectedMinutes = this.data.timeArray[1][selectedTime[1]];
    this.setData({
      timeIndex: selectedTime,
      timeDisplay: `${selectedHours}:${selectedMinutes}`
    });
  },
  // 处理颜色选择器的变化
  onColorChange(e) {
    this.setData({
      selectedColor: e.detail.value
    });
  },

  // 处理应用颜色按钮的点击
  applyColor() {
    const newColor = this.data.selectedColor;
    this.setData({
      selectedColor: newColor
    });
    this.updateNavigationBarColor(newColor);
    this.updateTabBarColor(newColor);
    wx.setStorageSync('themeColor', newColor); // 保存颜色到本地存储
  },

  // 应用存储中的主题色
  applyStoredThemeColor() {
    const storedColor = wx.getStorageSync('themeColor');
    if (storedColor) {
      this.setData({
        selectedColor: storedColor
      });
      this.updateNavigationBarColor(storedColor);
      this.updateTabBarColor(storedColor);
    }
  },

  // 更新顶部导航栏颜色
  updateNavigationBarColor(color) {
    wx.setNavigationBarColor({
      frontColor: '#ffffff', // 文字颜色
      backgroundColor: color, // 背景颜色
      animation: {
        duration: 400,
        timingFunc: 'easeIn'
      }
    });
  },

  // 更新底部 tabBar 颜色
  updateTabBarColor(color) {
    const tabBarConfig = {
      backgroundColor: color,
      color: '#ffffff', // 文字颜色
      selectedColor: '#FFD700' // 选中时的颜色
    };

    wx.setStorageSync('tabBarConfig', tabBarConfig); // 保存 tabBar 配置到本地存储
    this.setTabBarColor(tabBarConfig);

    // 修改 app.json 中的 tabBar 配置
    wx.getStorageSync('tabBarConfig', (tabBarConfig) => {
      wx.setStorageSync('tabBarConfig', tabBarConfig); // 更新 tabBar 配置
    });
  },

  // 更新 tabBar 的颜色
  setTabBarColor(config) {
    wx.setTabBarStyle({
      backgroundColor: config.backgroundColor,
      color: config.color,
      selectedColor: config.selectedColor
    });
  },

  // 获取某个月份的天数
  getDaysInMonth: function(year, month) {
    return new Date(year, month, 0).getDate();
  },

  // 处理时间变化
  bindTimeChange: function(e) {
    const selectedTime = e.detail.value;
    const selectedYear = this.data.timeArray[0][selectedTime[0]];
    const selectedMonth = this.data.timeArray[1][selectedTime[1]];
    const selectedDay = this.data.timeArray[2][selectedTime[2]];
    const selectedHours = this.data.timeArray[3][selectedTime[3]];
    const selectedMinutes = this.data.timeArray[4][selectedTime[4]];

    // 更新天数数组
    const daysArray = [];
    const daysInMonth = this.getDaysInMonth(selectedYear, selectedMonth);
    for (let i = 1; i <= daysInMonth; i++) {
      daysArray.push(i < 10 ? '0' + i : '' + i);
    }
    this.setData({
      'timeArray[2]': daysArray,
      'timeIndex[2]': selectedDay - 1 < daysInMonth ? selectedDay - 1 : daysInMonth - 1,
      timeDisplay: `${selectedYear}-${selectedMonth}-${daysArray[selectedDay - 1]} ${selectedHours}:${selectedMinutes}`
    });
  },

  // 切换时间选择器启用状态
  togglePicker: function() {
    this.setData({
      isPickerEnabled: !this.data.isPickerEnabled
    });
  },

  // 处理分类切换
  bindCategoryChange: function(e) {
    const index = e.detail.value;
    this.setData({
      selectedIndex: index,
      currentCategory: this.data.categories[index]
    });
  },

  handleSort: function(e) {
    // const { category1Data } = this.data;
    const { index } = e.currentTarget.dataset;
    const newIndex = e.detail.y > 0 ? index + 1 : index - 1;

    // 保存当前的拖拽索引
    this.setData({
      currentDragIndex: newIndex
    });

    // if (newIndex >= 0 && newIndex < category1Data.length) {
    //   const item = category1Data.splice(index, 1)[0];
    //   category1Data.splice(newIndex, 0, item);

    //   this.setData({
    //     category1Data
    //   });
    // }
  },

  confirmSort: function() {
    const { currentDragIndex, category1Data } = this.data;
    if (currentDragIndex !== null && currentDragIndex >= 0 && currentDragIndex < category1Data.length) {
      const item = category1Data.splice(currentDragIndex, 0, item);
      category1Data.splice(currentDragIndex, 0, item);

      // 保存排序后的数据到本地存储
      wx.setStorageSync('category1Data', category1Data);

      this.setData({
        category1Data,
        currentDragIndex: null // 重置索引
      });
    }
  },

  // 显示选择器
  showPicker: function() {
    this.setData({
      showPicker: true
    });
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