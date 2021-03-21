// miniprogram/pages/index/index.js
var app = getApp()
const db = wx.cloud.database()
wx.cloud.init({
    env: "voice-collect-2g7jf1mv64819153"
})
Page({

    /**
     * 页面的初始数据
     */
    data: {
        textLi: []
    },

    gotoRecord: function(e) {
        var recordValue = e.currentTarget.dataset.key
        console.log(recordValue)
        app.globalData.recordValue = recordValue
        wx.navigateTo({
          url: '../record/record',
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var _this = this;
        console.log("check database")
        db.collection("VoiceData").get({
            success: res => {
                console.log("database: ok")
                console.log(res.data)
                this.setData({
                    textLi: res.data
                })
            },
            fail: err => {
                console.log(err)
            }
        })
        console.log(this.data.textLi)
        wx.cloud.callFunction({
            // 云函数名称
            name: 'testUpdate',
            success: function(res) {
              console.log("res:", res.result)
            },
            fail: console.error
          })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})