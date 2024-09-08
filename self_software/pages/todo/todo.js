//bug: 微信用户获取（版本问题）
//bug: 修改的默认日期为今天
//bug: 点击详情页之后点击修改/添加卡片会叠加
Page({
  data: { // mark: data
    // imageUrl: '',
    todoList: [],

    defaultYear: new Date().getFullYear(), // 默认年份
    tags: ['all', '工作', '个人', '学习'],
    selectedTag: 'all',   //添加todo用
    hasTodo: true,
    showModal: false,
    selectedTag_1: 'all',
    status: true,  //true: 事件还存在（未解决）
    _id: '',
    title: '',
    description: '',
    endTime: '',
// 下面的修改用到
    editTitle: '',
    editDescription: '',
    editEndTime: '',
    editSelectedTag: 'all',
    showEditModal: false,
    isShowDetails: false,
    selectedTodoId: null, // 当前选中事件的ID
    
    sentences: [
      "不去追逐，永远不会拥有。",
      "别害怕，年轻叫你勇敢。",
      "你终究会成为你想成为的人。",
      "我不停奔跑",
      "那些你努力游向岸的日子，都有它的意义。",
      "立志要如山，行道要如水。",
      "自律者方能自由",
      "路是脚踏出来的，历史是人写出来的。",
      "匹夫不可夺志也。",
      "立志在坚不欲说，成功在久不在速。",
      "朋友未来属于你自己。",
    ],
    currentsentences: ""
  },

  // getImg: function () {
  //   wx.cloud.getTempFileURL({
  //     fileList: ['cloud://cloud-developer-0g62palod4333641.636c-cloud-developer-0g62palod4333641-1328827353/background.jpg'] // 传入文件ID
  //   }).then(res => {
  //     console.log('File URL:', res.fileList[0].tempFileURL);
  //     this.setData({
  //       imageUrl: res.fileList[0].tempFileURL
  //     });
  //   }).catch(err => {
  //     console.error('Failed to get temp file URL:', err);
  //   });
  // },

  // 随机获取数组中的一项
  getRandomsentences: function () {
    const { sentences } = this.data;
    const randomIndex = Math.floor(Math.random() * sentences.length); // 随机索引
    return sentences[randomIndex];
  },

  // 点击切换随机内容
  changesentences: function () {
    const newsentences = this.getRandomsentences();
    this.setData({
      currentsentences: newsentences // 更新页面显示
    });
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // this.getTodoList();
    // 初始化时间选择范围
    // const months = [];
    // const days = [];
    // const hours = [];
    // const minutes = [];

    const today = new Date();
    const year = String(today.getFullYear());
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const defaultDate = `${year}-${month}-${day}`;

    // const 
    // const year1 = String(today.getFullYear());
    // const month1 = String(today.getMonth() + 1).padStart(2, '0');
    // const day1 = String(today.getDate()).padStart(2, '0');
    // const defaultDate1 = `${year1}-${month1}-${day1}`;

    this.setData({
      endTime: defaultDate,
      editEndTime: defaultDate,
      currentsentences: this.getRandomsentences() // 初始化随机展示一条内容
 
    });
    
    // console.log("editEndTime",this.data.editEndTime);
    this.searchTodoByTag('all');
    // this.setData({
    //   editStartTime: formattedDate
    // });
  },

  showDetails: function (e) {
    const selectedId = e.currentTarget.dataset.id;
    this.setData({
      selectedTodoId: selectedId,
      animationClass: 'slit-in-vertical',
      showModal: false,
      showEditModal: false
    });
  },

  unShowDetails: function () {
    this.setData({
      selectedTodoId: null
    })
  },

  statusChange: function (e) { // mark: statusChange
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
          this.searchTodoByTag(this.data.selectedTag_1);
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

  // 显示弹出表单
  openModal: function() {
    this.setData({
      showModal: true,
      showEditModal: false,
      animationClass: 'slit-in-vertical'
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
      showModal: false,
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
    // console.log("endTIME",endTIME)
  },

  closeEditModal() {
    this.setData({
      showEditModal: false
    });
    this.searchTodoByTag(this.data.selectedTag_1);
  },

  // 关闭弹出表单
  // closeModal: function() {
  //   this.setData({
  //     showModal: false
  //   });
  // },

  closeModal: function(){
    this.setData({
      showModal: false,
      // selectedTag: 'all'
    });
    this.searchTodoByTag(this.data.selectedTag_1);
    const today = new Date();
    const entTime = `${String(today.getFullYear())}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    this.setData({
      title: '',
      description: '',
      endTime: entTime,
      selectedTag: 'all'
    })
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
  // onStartTimeChange: function(e) { // mark: onStartTimeChange
  //   console.log("赋给startTime的：",e.detail.value);
  //   this.setData({  
  //     startTime: e.detail.value
  //   });
  // },

  // 获取结束时间
  onEndTimeChange: function(e) {
    console.log("endTime",e.detail.value);
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
  // onEditStartTimeChange(e) {
  //   const selectedDate = e.detail.value; // 选中的日期是 "YYYY-MM-DD" 格式
  //   const newMonth = new Date(selectedDate)
    
  //   const formattedDate = `${String(newMonth.getMonth() + 1).padStart(2, '0')}-${String(newMonth.getDate()).padStart(2, '0')}`; // 调用格式化函数
  //   console.log(selectedDate)
  //   // console.log(newMonth)
  //   console.log(formattedDate)
  //   this.setData({
  //     editStartTime: formattedDate
  //   });
  // },
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
          // this.onTagChangeShow();
          // this.searchTodoByTag(this.data.selectedTag);
          this.searchTodoByTag(this.data.selectedTag_1);
          
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








// 提交待办事项
  addTodo: function() { // mark: addTodo // mark: addTodo
    const { endTime } = this.data;
    // console.log('endTime:', new Date(this.data.endTime + "T23:59:59"));
    
    if (!endTime) {
      wx.showToast({
        title: '请选择时间',
        icon: 'none',
      });
      return;
    }

    if (!this.data.title || this.data.title.trim() === '') {
      wx.showToast({
        title: '事件名不能为空哇~~',
        icon: 'none',
      });
      return; // 退出函数，防止继续执行后续代码
    }
    wx.showLoading({
      title: '加载中...',
    });
    wx.cloud.callFunction({
      name: 'addTodo',
      data: {
        title: this.data.title,
        description: this.data.description,
        // startTime: new Date(this.data.startTime + "T00:00:00"),
        // startTime: startTime,
        endTime: new Date(this.data.endTime + "T23:59:59"),
        // endTime: endTime,
        tag: this.data.selectedTag
      },
      success: res => {
        if (res.result.success) {
          wx.showToast({
            title: '添加成功！',
            icon: 'success'
          });
          this.closeModal();
          this.setData({
            selectedTag_1: 'all'
          })
          this.searchTodoByTag('all');
          
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
      },
      complete: () => {
        // 隐藏加载中样式
        wx.hideLoading();
      }
    });
  },

  // 修改表单并重新加载
  onTagChangeShow: function(e){ // mark: onTagChangeShow
    // console.log("e", e);
    const selectedTag = this.data.tags[e.detail.value];
    this.setData({
      selectedTag_1: selectedTag
    });
    this.searchTodoByTag(this.data.selectedTag_1);

  },

  searchTodoByTag: function (tag) { // mark: searchTodoByTag
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
            const formattedDate = `${String(endTime.getMonth() + 1).padStart(2, '0')}-${String(endTime.getDate()).padStart(2, '0')}`;
            // `${String(endTime.getHours()).padStart(2, '0')}:${String(endTime.getMinutes()).padStart(2, '0')}`;
            return {
              ...todo,
              formattedDate // 添加格式化后的日期字段
            };
          });


          // 旧
          // 添加排序功能
          const sortedData = formattedData.sort((a, b) => {
          // status 为 false 的项排在前面
          return (b.status === false) - (a.status === false);
          });

          // 新
          const falseStatusItems = sortedData.filter(item => item.status === false);
          const trueStatusItems = sortedData.filter(item => item.status === true);

          falseStatusItems.sort((a, b) => new Date(a.endTime) - new Date(b.endTime)); // 对 status 为 false 的项按时间排序
          trueStatusItems.sort((a, b) => new Date(a.endTime) - new Date(b.endTime)); // 对 status 为 true 的项按时间排序


          const finalSortedData = [...falseStatusItems, ...trueStatusItems];

          this.setData({
            todoList: finalSortedData
          }, () => {
            // 这里是 setData 成功后的回调,确保 hasTodo 数据也更新
            if (!sortedData || sortedData.length === 0) {
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
      },
      complete: () => {
        // 隐藏加载中样式
        wx.hideLoading();
      }
    });
  },


  // 调用 getTodoList 云函数
  // getTodoList: function () {
  //   wx.cloud.callFunction({
  //     name: 'getTodoList',
  //     success: res => {
  //       if (res.result.success) {
  //         const formattedData = res.result.data.map(todo => {
  //           const endTime = new Date(todo.endTime); 
          //   const formattedDate = `${endTime.getMonth() + 1}/${endTime.getDate()} ${String(endTime.getHours()).padStart(2, '0')}:${String(endTime.getMinutes()).padStart(2, '0')}`;
          //   return {
          //     ...todo,
          //     formattedDate // 添加格式化后的日期字段
          //   };
          // });
    
        //   this.setData({
        //     todoList: formattedData
        //   });
        //   // this.setData({
        //   //   todoList: res.result.data
        //   // })
        //   console.log("getTodoList返回数据",res.result.data )
        // } else {
        //   console.error('Failed to get todo list:', res.result.errorMessage)
        // }
  //     },
  //     fail: err => {
  //       console.error('Failed to call cloud function:', err)
  //     }
  //   })
  // },

  deleteTodo: function(e){ // mark: deleteTodo
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
                this.searchTodoByTag(this.data.selectedTag_1);

// 由于样例添加麻烦，改成this.data.selectedTag后还没测试，但是可以成功删除了
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