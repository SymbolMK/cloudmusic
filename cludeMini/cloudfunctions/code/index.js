// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  try {
    const result = await cloud.openapi.wxacode.getUnlimited({
      scence: wxContext.OPENID || '',
      page: 'pages/home/index',
      width: 280
    })
    return result
  } catch(e) {
    return e
  }
}