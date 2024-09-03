// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    const db = cloud.database();
    const todoList = await db.collection('todos').get();

    return {
      success: true,
      data: todoList.data
    };
  } catch (err) {
    return {
      success: false,
      errorMessage: err.message
    };
  }
}
