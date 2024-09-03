// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  const { todoId } = event;
  try {
    await db.collection('todos').doc(todoId).remove();
    return {
      success: true,
      message: 'Todo item deleted successfully'
    };
  } catch (error) {
    return {
      success: false,
      errorMessage: error.message
    };
  }
}