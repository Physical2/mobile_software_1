// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境
const db = cloud.database();
const todosCollection = db.collection('todos'); // 替换为你的集合名称

// 云函数入口函数
exports.main = async (event, context) => {
  const { _id, title, description, endTime, tag } = event;

  try {
    // 使用 _id 更新数据库中的对应记录
    const result = await todosCollection.doc(_id).update({
      data: {
        title: title,
        description: description,
        // startTime: new Date(startTime), // 转换为 Date 类型
        endTime: new Date(endTime), // 转换为 Date 类型
        tag: tag
      }
    });

    return {
      success: true,
      data: result
    };
  } catch (error) {
    console.error('Error updating todo:', error);
    return {
      success: false,
      errorMessage: error.message
    };
  }

  
}