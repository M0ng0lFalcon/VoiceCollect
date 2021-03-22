// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: "voice-collect-2g7jf1mv64819153"
})

const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
    let { OPENID, APPID, UNIONID } = cloud.getWXContext()
    console.log("[!] this is openid:", OPENID)
    console.log("[!] typeof openid:", typeof OPENID)
    try {
        return await db.collection('Users').where({
            _openid: OPENID
        }).update({
            data: {
                voices: _.push(event.voice)
            },
            success: res => {
                console.log(res)
            }
        })
    }
    catch (e) {
        console.log(e)
    }
}