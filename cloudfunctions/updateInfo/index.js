// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  console.log(event["openid"])
  console.log(event)

  try {
    var checkId = event.checkId
    var checked = {}

    var data = {}

    data["info"] = [event.district, event.division, event.club, event.name]

    console.log("I'm out! ")

    const countResult = await db.collection('records').where({
      openId: event.userInfo.openId
    }).count()
    const total = countResult.total

    console.log(total)

    if (total == 0) {
      console.log("I'm coming! ")
      data["openId"] = event.userInfo.openId
      return await db.collection('records').add({
        data: data
      })
    } else {
      return await db.collection('records').where({
        openId: event.userInfo.openId
      })
        .update({
          data
        })
    }
  } catch (e) {
    console.error(e)
  }
}