// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
  const db = cloud.database()
  const todosCollection = db.collection('todos')

  try {
    return await db.collection('trash').orderBy('click_times', 'desc').limit(20).get()
  } catch (e) {
    console.error(e)
  }

  // try {
  //   // 获取待办事项列表
  //   const todoList = await todosCollection.get()
  //   return {
  //     success: true,
  //     data: todoList.data
  //   }
  // } catch (error) {
  //   return {
  //     success: false,
  //     errorMessage: error.message
  //   }
  // }
}
