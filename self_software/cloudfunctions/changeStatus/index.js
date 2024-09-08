// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  const { _id, status } = event;
  console.log("Received _id:", _id);
  console.log("Received status:", status);

  try {
    // 更新数据库中对应文档的 status 字段
    const res = await db.collection('todos') // 替换为你的集合名称
      .doc(_id) // 使用文档的 _id 进行定位
      .update({
        data: {
          status: status
        }
      });

    return {
      success: true,
      data: res,
    };
  } catch (error) {
    return {
      success: false,
      errorMessage: error.message,
    };
  }
  
}