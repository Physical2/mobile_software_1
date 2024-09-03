// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
  const db = cloud.database()
  // 此处留空，用于后续实现 addTodo 逻辑

  try {
    return await db.collection('trash').orderBy('click_times', 'desc').limit(20).get()
  } catch (e) {
    console.error(e)
  }
  // return {
  //   success: false,
  //   message: "addTodo function not implemented yet."
  // }
}
