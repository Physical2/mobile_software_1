// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

const db = cloud.database()
const todosCollection = db.collection('todos')

// 云函数入口函数
exports.main = async (event, context) => {
  const { title, description, endTime, tag } = event

  try {
    // 添加待办事项到数据库
    // const startTimeAsDate = new Date(startTime);
    const endTimeAsDate = new Date(endTime);

    const result = await todosCollection.add({
      data: {
        title,
        description,
        endTime: endTimeAsDate,
        tag,
        createAt: new Date(), // 自动添加创建时间
        status: false // 默认状态为 false
      }
    })
    return {
      success: true,
      _id: result._id
    }
  } catch (error) {
    console.error('Error adding todo:', error)
    return {
      success: false,
      errorMessage: error.message
    }
  }
}