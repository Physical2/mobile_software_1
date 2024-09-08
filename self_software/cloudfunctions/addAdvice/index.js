// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

const db = cloud.database();
const _ = db.command;

// 云函数入口函数
exports.main = async (event, context) => {
  const { userInfo, adviceContent } = event;  // 获取传递过来的参数

  if (!adviceContent) {
    return {
      success: false,
      message: '建议内容不能为空'
    };
  }

  try {
    // 插入数据到 'advice' 集合中
    const result = await db.collection('advices').add({
      data: {
        adviceContent: adviceContent,  // 建议内容
        createTime: db.serverDate(),   // 自动添加时间戳
        userInfo: userInfo             // 用户信息
      }
    });

    return {
      success: true,
      message: '提交成功',
      data: result
    };
  } catch (error) {
    return {
      success: false,
      message: '提交失败',
      error: error
    };
  }
}