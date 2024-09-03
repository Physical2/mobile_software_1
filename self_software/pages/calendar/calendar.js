const app = getApp();

Page({
  data: {
    spotMap: {
      y2022m5d9: 'deep-spot',
      y2022m5d10: 'spot',
      y2022m6d10: 'spot',
      y2022m7d10: 'spot',
      y2022m8d10: 'spot',
      y2022m10d1: 'spot',
      y2023m5d10: 'spot',
    },
    // 例子，今天之后的日期不能被选中
    // disabledDate({ day, month, year }) {
    //   const now = new Date();
    //   const date = new Date(year, month - 1, day);
    //   return date > now;
    // },
    // 需要改变日期时所使用的字段
    changeTime: '',
    // 存储已经获取过的日期
    dateListMap: [],
    chooseDate: '',
    // todoTime: '13:45\n14:45',
    filteredList: [],
    hasTodo: true
  },

  
  // 获取日期数据，通常用来请求后台接口获取数据
  getDateList({ detail }) {
    // 检查是否已经获取过该月的数据
    if (this.filterGetList(detail)) {
      // 获取数据
      console.log(detail, '获取数据');
    }
  },
  // 过滤重复月份请求的方法
  filterGetList({ setYear, setMonth }) {
    const dateListMap = new Set(this.data.dateListMap);
    const key = `y${setYear}m${setMonth}`;
    if (dateListMap.has(key)) {
      return false;
    }
    dateListMap.add(key);
    this.setData({
      dateListMap: [...dateListMap],
    });
    return true;
  },
  // 日期改变的回调
  selectDay({ detail }) {
    console.log(detail, 'selectDay detail');
    const {year, month, day} = detail;
    const formattedDate = `${month}月${day}日`;
    console.log('拼接好的选中日期', formattedDate);

    this.searchTodoByTime(year, month, day);
    this.setData({
      chooseDate: formattedDate,
    });
  },
  // 展开收起时的回调
  openChange({ detail }) {
    console.log(detail, 'openChange detail');
  },
  changetime() {
    this.setData({
      changeTime: '2024/9/1',
    });
  },

  searchTodoByTime: function(year, month, day){
    wx.cloud.callFunction({
      name: 'searchTodoByTime',
      data: {
        year: year,
        month: month,
        day: day
      },
      success: res => {
        if (res.result.success) {
          console.log('Filtered todos:', res.result.data);
          // 处理筛选后的待办事件数据
          const formattedData = res.result.data.map(todo => {
            const endTime = new Date(todo.endTime); 
            const formattedDate = `${endTime.getMonth() + 1}/${endTime.getDate()} ${String(endTime.getHours()).padStart(2, '0')}:${String(endTime.getMinutes()).padStart(2, '0')}`;
            return {
              ...todo,
              formattedDate // 添加格式化后的日期字段
            };
          });

          this.setData({
            filteredList: formattedData
          }, () => {
            // 这里是 setData 成功后的回调
            console.log("filteredList", this.data.filteredList);
          
            // 确保 hasTodo 数据也更新
            if (!formattedData || formattedData.length === 0) {
              this.setData({
                hasTodo: false
              }, () => {
                console.log("hasTodo", this.data.hasTodo);
              });
            } else {
              this.setData({
                hasTodo: true
              }, () => {
                console.log("hasTodo", this.data.hasTodo);
              });
            }
          });          
        } else {
          console.error('Failed to get todos by end time:', res.result.errorMessage);
        }
      },
      fail: err => {
        console.error('Failed to call cloud function:', err);
      }
    });
  }

});
