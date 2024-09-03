// pages/todo/todo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // todoTime: '12:51\n12:56',
    todoList: [],
    title: '',
    description: '',
    startTime: 'Select Start Time',
    endTime: 'Select End Time',
    selectedTag: 'Select Tag',
    tags: ['all', '工作', '个人', '学习'],
    selectedTag: 'all',
    hasTodo: true,
    showModal: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // this.getTodoList();
    this.searchTodoByTag('all');
  },

  // 显示弹出表单
  openModal: function() {
    this.setData({
      showModal: true
    });
  },

  // 关闭弹出表单
  closeModal: function() {
    this.setData({
      showModal: false
    });
  },

  // 获取标题输入
  onTitleInput: function(e) {
    this.setData({
      title: e.detail.value
    });
  },

  // 获取描述输入
  onDescriptionInput: function(e) {
    this.setData({
      description: e.detail.value
    });
  },

  // 获取开始时间
  onStartTimeChange: function(e) {
    this.setData({
      startTime: e.detail.value
    });
  },

  // 获取结束时间
  onEndTimeChange: function(e) {
    this.setData({
      endTime: e.detail.value
    });
  },

  // 获取标签选择
  onTagChange: function(e) {
    this.setData({
      selectedTag: this.data.tags[e.detail.value]
    });
  },

  // 提交待办事项
  addTodo: function() {
    wx.cloud.callFunction({
      name: 'addTodo',
      data: {
        title: this.data.title,
        description: this.data.description,
        startTime: this.data.startTime,
        endTime: this.data.endTime,
        tag: this.data.selectedTag
      },
      success: res => {
        if (res.result.success) {
          wx.showToast({
            title: 'Todo added successfully',
            icon: 'success'
          });
          this.closeModal();
          this.onTagChangeShow();
          // 这里可以添加代码来更新页面显示的待办事项列表
        } else {
          wx.showToast({
            title: 'Failed to add todo1',
            icon: 'none'
          });
          console.error('获取待办事项失败:', res.result.errorMessage);
        }
      },
      fail: err => {
        console.error('Failed to call cloud function:', err);
        wx.showToast({
          title: 'Failed to add todo2',
          icon: 'none'
        });
      }
    });
  },

  // 修改表单并重新加载
  onTagChangeShow: function(e){
    const selectedTag = this.data.tags[e.detail.value];
    this.setData({
      selectedTag: selectedTag
    });
    this.searchTodoByTag(selectedTag);
  },


  searchTodoByTag: function (tag) {
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
          console.log('获取到的待办事项:', res.result.data);
        } else {
          console.error('获取待办事项失败:', res.result.errorMessage);
        }
      },
      fail: err => {
        console.error('调用云函数失败:', err);
      }
    });
  },


  // 调用 getTodoList 云函数
  getTodoList: function () {
    wx.cloud.callFunction({
      name: 'getTodoList',
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
          });
          // this.setData({
          //   todoList: res.result.data
          // })
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
          wx.cloud.callFunction({
            name: 'deleteTodo',
            data: {
              todoId: todoID // 替换为实际的待办事件ID
            },
            success: res => {
              if (res.result.success) {
                console.log('成功删除！');
                this.searchTodoByTag(this.data.selectedTag);
// 由于样例添加麻烦，改成this.data.selectedTag后还没测试，但是可以成功删除了
                // 处理成功删除的逻辑
              } else {
                console.error('Failed to delete todo item:', res.result.errorMessage);
              }
            },
            fail: err => {
              console.error('Failed to call cloud function:', err);
            }
          });
        }
      }
    })
    
  },

  

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