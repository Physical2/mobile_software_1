// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  const { year, month, day } = event;

  // 创建开始时间和结束时间
  const startDate = new Date(year, month - 1, day, 0, 0, 0);
  const endDate = new Date(year, month - 1, day, 23, 59, 59);

  try {
    const result = await db.collection('todos').where({
      endTime: db.command.gte(startDate).and(db.command.lte(endDate))
    }).get();

    return {
      success: true,
      data: result.data
    };
  } catch (error) {
    return {
      success: false,
      errorMessage: error.message
    };
  }
}