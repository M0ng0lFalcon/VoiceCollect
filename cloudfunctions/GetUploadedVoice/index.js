// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: "voice-collect-2g7jf1mv64819153"
})

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()

    try {
        return await db.collection('Users').where({
            _openid: wxContext.OPENID
        }).get({
            success: function(res) {
                return res
            },
            fail: function(err) {
                return err
            }
        })
    }
    catch(e) {
        console.log(e)
    }
}