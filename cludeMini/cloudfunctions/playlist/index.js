// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const rp = require('request-promise')
const URL = 'http://musicapi.xiecheng.live/personalized'
const playStore = db.collection('playlist') 
const MAX_LIMIT = 100
// 云函数入口函数
exports.main = async (event, context) => {
  // const list = await playStore.get() || []
  const count = await playStore.count()
  const fetchTime = Math.ceil(count.total / MAX_LIMIT)
  let task = []
  for (let i = 0; i < fetchTime; i++) {
    let promise = playStore.skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
    task.push(promise)
  }
  let list = {
    data: []
  }
  if (task.length > 0) {
     list = (await Promise.all(task)).reduce((acc, cur) => {
       return {
         data: acc.data.concat(cur.data)
       }
     })
  }

  const _resList = await rp(URL).then(res => {
    let _res = JSON.parse(res)
    if(_res.code == 200)  {
      return _res.result
    } else {
      return []
    }
  })
  let newData = []
  for (let i = 0; i < _resList.length; i++) {
    let flag = true
    for (let k = 0; k < list.data.length; k++) {
      if (_resList[i].id === list.data[k].id) {
        flag = false
        break
      }
    }
    if (flag) {
      newData.push(_resList[i])
    } 
  }

  for (let i = 0; i < newData.length; i++) {
    const _ele = newData[i]
    await playStore.add({
      data: {
        ..._ele,
        createTime: db.serverDate()
      }
    })
    
  }
  return newData.length

}