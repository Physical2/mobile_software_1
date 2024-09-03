// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

const db = cloud.database();
const todosCollection = db.collection('todos');

// 云函数入口函数
exports.main = async (event, context) => {
  // const wxContext = cloud.getWXContext()
  const { tag } = event;

  try {
    let todos;
    if (tag === 'all') {
      // 获取所有待办事项
      todos = await todosCollection.get();
    } else {
      // 根据标签筛选待办事项
      todos = await todosCollection.where({
        tag: tag
      }).get();
    }

    console.log("云函数data", todos.data);
    return {
      success: true,
      data: todos.data
      
    };
  } catch (err) {
    return {
      success: false,
      errorMessage: err.message
    };
  }
}