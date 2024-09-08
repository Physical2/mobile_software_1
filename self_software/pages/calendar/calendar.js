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
    hasTodo: true,
    status: false,
    _id: '',
    year: 2024,
    month: 1,
    day: 1,
    title: '',
    description: '',
    endTime: '',
    defaultYear: new Date().getFullYear(),
    showModal: false,
    tags: ['all', '工作', '个人', '学习'],

    // 下面的修改用到
    editTitle: '',
    editDescription: '',
    editEndTime: '',
    editSelectedTag: 0,
    showEditModal: false,
    isShowDetails: false,
    selectedTodoId: null // 当前选中事件的ID

  },

  onShow: function (options) {
    const { year, month, day } = this.data;
    if (year && month && day) {
      // 调用 searchTodoByTime 以更新数据
      this.searchTodoByTime(year, month, day);
    } else {
      console.log('未选择日期，无法更新数据');
    }
  },

  onLoad: function(options) {
    const today = new Date();
    const year = String(today.getFullYear());
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const defaultDate = `${year}-${month}-${day}`;

    this.setData({
      // endTime: defaultDate,
      editEndTime: defaultDate
    });
    this.searchTodoByTime(year, month, day);
  },

  showDetails: function (e) {
    const selectedId = e.currentTarget.dataset.id;
    this.setData({
      selectedTodoId: selectedId,
      animationClass: 'slit-in-vertical'
    });
  },

  unShowDetails: function () {
    this.setData({
      selectedTodoId: null
    })
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
      year: year,
      month: month,
      day: day
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
    wx.showLoading({
      title: '加载中...',
    });
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
            const formattedDate = `${String(endTime.getMonth() + 1).padStart(2, '0')}-${String(endTime.getDate()).padStart(2, '0')}`;
            return {
              ...todo,
              formattedDate // 添加格式化后的日期字段
            };
          });

          const sortedData = formattedData.sort((a, b) => {
            // status 为 false 的项排在前面
            return (b.status === false) - (a.status === false);
            });
            const falseStatusItems = sortedData.filter(item => item.status === false);
          const trueStatusItems = sortedData.filter(item => item.status === true);

          falseStatusItems.sort((a, b) => new Date(a.endTime) - new Date(b.endTime)); // 对 status 为 false 的项按时间排序
          trueStatusItems.sort((a, b) => new Date(a.endTime) - new Date(b.endTime)); // 对 status 为 true 的项按时间排序
          const finalSortedData = [...falseStatusItems, ...trueStatusItems];
          this.setData({
            filteredList: finalSortedData
          }, () => {
            // 这里是 setData 成功后的回调
            console.log("filteredList", this.data.filteredList);
          
            // 确保 hasTodo 数据也更新
            if (!formattedData || formattedData.length === 0) {
              this.setData({
                hasTodo: false
              }, () => {
                // console.log("hasTodo", this.data.hasTodo);
              });
            } else {
              this.setData({
                hasTodo: true
              }, () => {
                // console.log("hasTodo", this.data.hasTodo);
              });
            }
          });          
        } else {
          console.error('Failed to get todos by end time:', res.result.errorMessage);
        }
      },
      fail: err => {
        console.error('Failed to call cloud function:', err);
      },
      complete: () => {
        // 隐藏加载中样式
        wx.hideLoading();
      }
    });
  },

  deleteTodo: function(e){
    const todoID = e.currentTarget.dataset.id;
    console.log("todoID", e.currentTarget.dataset.id);
    wx.showModal({
      title: '确认删除',
      content: '你确定要删除这个待办事项吗？',
      complete: (res) => {
        if (res.cancel) {
          console.log('用户取消了删除操作');
        }
    
        if (res.confirm) {
          wx.showLoading({
            title: '加载中...',
          });
          wx.cloud.callFunction({
            name: 'deleteTodo',
            data: {
              todoId: todoID // 替换为实际的待办事件ID
            },
            success: res => {
              if (res.result.success) {
                console.log('成功删除！');
                this.searchTodoByTime(this.data.year, this.data.month, this.data.day);
                // 处理成功删除的逻辑
              } else {
                console.error('Failed to delete todo item:', res.result.errorMessage);
              }
            },
            fail: err => {
              console.error('Failed to call cloud function:', err);
            },
            complete: () => {
              // 隐藏加载中样式
              wx.hideLoading();
            }
          });
        }
      }
    })
  },

  searchTodoByTag: function (tag) {
    wx.showLoading({
      title: '加载中...',
    });
    wx.cloud.callFunction({
      name: 'searchTodoByTag',
      data: {
        tag: tag
      },
      success: res => {
        if (res.result.success) {
          const formattedData = res.result.data.map(todo => {
            const endTime = new Date(todo.endTime); 
            const formattedDate = `${endTime.getMonth() + 1}/${endTime.getDate()} ${String(endTime.getHours()).padStart(2, '0')}:${String(endTime.getMinutes()).padStart(2, '0')}`;
            return {
              ...todo,
              formattedDate // 添加格式化后的日期字段
            };
          });
          this.setData({
            todoList: formattedData
          }, () => {
            // 这里是 setData 成功后的回调
            // console.log("filteredList", this.data.filteredList);
          
            // 确保 hasTodo 数据也更新
            if (!formattedData || formattedData.length === 0) {
              this.setData({
                hasTodo: false
              }, () => {
                // console.log("hasTodo", this.data.hasTodo);
              });
            } else {
              this.setData({
                hasTodo: true
              }, () => {
                // console.log("hasTodo", this.data.hasTodo);
              });
            }
          });
          console.log('获取到的待办事项:', res.result.data);
        } else {
          console.error('获取待办事项失败:', res.result.errorMessage);
        }
      },
      fail: err => {
        console.error('调用云函数失败:', err);
      },
      complete: () => {
        // 隐藏加载中样式
        wx.hideLoading();
      }
    });
  },

  statusChange: function (e) {
    const docId = e.currentTarget.dataset.id; // 获取传递的 _id
    const currentStatus = e.currentTarget.dataset.status; // 获取传递的 status
    const newStatus = !currentStatus; // 切换状态
    console.log("status:", newStatus);
    console.log("_id:", docId);
    // const newStatus = !this.data.status; // 取反状态
    // const docId = this.data._id; // 获取文档ID
    // 调用云函数更改数据库中的 status
    wx.showLoading({
      title: '加载中...',
    });
    wx.cloud.callFunction({
      name: 'changeStatus',
      data: {
        _id: docId,
        status: newStatus
      },
      success: res => {
        console.log(res);
        if (res.result.success) {
          
          // wx.showToast({
          //   title: '状态更新成功',
          //   icon: 'success'
          // });
          // console.log("年月日",this.data.year, this.data.month, this.data.day)
          this.searchTodoByTime(this.data.year, this.data.month, this.data.day);
        } else {
          wx.showToast({
            title: '状态更新失败',
            icon: 'none'
          });
        }
      },
      fail: err => {
        console.error('调用云函数失败', err);
        wx.showToast({
          title: '状态更新失败',
          icon: 'none'
        });
      },
      complete: () => {
        // 隐藏加载中样式
        wx.hideLoading();
      }
    });
  },

  openEditModal: function (e) { // mark: openEditModal
    const { id, title, description, editendtime, tag } = e.currentTarget.dataset;
    const endTime = new Date(editendtime);
    const endTIME = `${String(endTime.getFullYear())}-${String(endTime.getMonth() + 1).padStart(2, '0')}-${String(endTime.getDate()).padStart(2, '0')}`;
    // const endTIME = `${String(endTime.getMonth() + 1).padStart(2, '0')}-${String(endTime.getDate()).padStart(2, '0')}`
    console.log(e.currentTarget.dataset);
    console.log(id, title, description, endTIME, tag);
    this.setData({
      showEditModal: true,
      editId: id,
      editTitle: title,
      editDescription: description,
      // editStartTime: starttime,
      // editEndTime: editendtime,
      editTime: endTIME,
      // editSelectedTag: this.data.tags.indexOf(tag)
      editSelectedTag: tag,
      animationClass: 'slit-in-vertical'
    });
  },

  closeEditModal() {
    this.setData({
      showEditModal: false
    });
    this.searchTodoByTime(this.data.year, this.data.month, this.data.day);
  },

  // 修改相关
  onEditTitleInput(e) { // mark: onEditTitleInput
    this.setData({
      editTitle: e.detail.value
    });
  },
  onEditDescriptionInput(e) {
    this.setData({
      editDescription: e.detail.value
    });
  },

  onEditEndTimeChange(e) { // mark: onEditEndTimeChange
    const selectedDate = e.detail.value; // 选中的日期是 "YYYY-MM-DD" 格式
    const newDay = new Date(selectedDate);
    const formattedDate = `${String(newDay.getFullYear())}-${String(newDay.getMonth() + 1).padStart(2, '0')}-${String(newDay.getDate()).padStart(2, '0')}`; // 调用格式化函数
    this.setData({
      editEndTime: formattedDate
    });
  },

  onEditTagChange(e) {
    this.setData({
      editSelectedTag: this.data.tags[e.detail.value]
    });
  },

  changeTodo: function () { // mark: changeTodo
    const { editId, editTitle, editDescription, editEndTime, editSelectedTag } = this.data;
    if (!editTitle || editTitle.trim() === '') {
      wx.showToast({
        title: '事件名不能修改为空哇~~',
        icon: 'none',
      });
      return; // 退出函数，防止继续执行后续代码
    }
    wx.showLoading({
      title: '加载中...',
    });
    wx.cloud.callFunction({
      name: 'changeTodo',
      data: {
        _id: editId,
        title: editTitle,
        description: editDescription,
        // startTime: new Date(editStartTime),
        endTime: new Date(editEndTime),
        tag: editSelectedTag
      },
      success: res => {
        if (res.result.success) {
          wx.showToast({
            title: '修改成功',
            icon: 'success'
          });
          this.closeEditModal();
          // 刷新todo列表
          // this.searchTodoByTag(this.data.selectedTag_1);
          this.searchTodoByTime(this.data.year, this.data.month, this.data.day);
        } else {
          wx.showToast({
            title: '修改失败',
            icon: 'none'
          });
        }
      },
      fail: err => {
        wx.showToast({
          title: '调用云函数失败',
          icon: 'none'
        });
        console.error('调用云函数失败:', err);
      },
      complete: () => {
        // 隐藏加载中样式
        wx.hideLoading();
      }
    });
  },

});
