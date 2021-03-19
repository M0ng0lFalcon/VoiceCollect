// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()


// 云函数入口函数
exports.main = async (event, context) => {

    db.collection('Users').where({
        data: {
            _openid: app.globalData.openId
        }
    }).get({
        success: function(res) {
            console.log(res.data)
        }
    })

    return {
        res: "ok"
    }
}