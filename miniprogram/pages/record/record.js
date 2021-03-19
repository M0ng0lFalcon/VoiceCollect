// miniprogram/pages/index/index.js
var app = getApp()
const db = wx.cloud.database()
const _ = db.command
Page({

    /**
     * 页面的初始数据
     */
    data: {
        record_class: "weui-btn weui-btn_primary",
        record_text: "开始录音",
        tempFilePath: "",
        voices: [],
        slideButtons: [{
            text: '提交',
            type: 'warn'
        }],
        recordValue: "",
    },

    recordingTimer: function () {
        var that = this;
        //将计时器赋值给setInter
        that.data.setInter = setInterval(
            function () {
                var time = that.data.recordingTimeqwe + 1;
                if (time > 60) {
                    wx.showToast({
                        title: '录音时长到一分钟啦',
                        duration: 1500,
                        mask: true
                    })
                    clearInterval(that.data.setInter);
                    that.shutRecording();
                    return;
                }
                that.setData({
                    recordingTimeqwe: time
                })
            }, 1000);
    },

    touchDown: function () {
        var _this = this;
        console.log("手指按下")
        this.setData({
            record_class: "weui-btn weui-btn_default",
            record_text: "录音中"
        })

        wx.startRecord({
            success: (res) => {
                // 录音文件的临时路径
                var tempFilePath = res.tempFilePath;
                _this.setData({
                    tempFilePath: res.tempFilePath
                })
                console.log("tempFilePath: " + _this.data.tempFilePath)


                // 弹窗提示
                wx.showToast({
                    title: '录音成功',
                    icon: 'success',
                    duration: 1000
                })
            },
            fail: function (res) {
                wx.showModal({
                    title: "提示",
                    content: "录音姿势不对!",
                    showCancel: false
                })
            }
        })
    },

    touchUp: function () {
        console.log("手指抬起")
        this.setData({
            record_class: "weui-btn weui-btn_primary",
            record_text: "开始录音"
        })

        wx.stopRecord()
    },

    gotoPlay: function (e) {
        var filePath = e.currentTarget.dataset.key;
        //点击开始播放 
        wx.showToast({
            title: '开始播放',
            icon: 'success',
            duration: 500
        })
        // innerAudioContext.play(this.data.tempFilePath)
        wx.playVoice({
            filePath: filePath,
            success: function () {
                wx.showToast({
                    title: '播放结束',
                    icon: 'success',
                    duration: 500
                })
            }
        })
    },

    slideBtnTap: function (e) {
        // console.log(e.currentTarget.dataset.key)
        var filePath = e.currentTarget.dataset.key
        var timestamp = Date.parse(new Date())
        var date = new Date(timestamp)
        // 年
        var Y = date.getFullYear();
        //月  
        var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
        //日  
        var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
        //时  
        var h = date.getHours();
        //分  
        var m = date.getMinutes();
        //秒  
        var s = date.getSeconds();
        var fileName = String(Y + M + D + h + m + s) + '.silk'

        wx.cloud.uploadFile({
            cloudPath: 'recordVoice/' + fileName,
            filePath: filePath,
            success: res => {
                console.log(res.fileID)

                wx.showToast({
                    title: '提交成功',
                    icon: 'success',
                    duration: 1000
                })
            }
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // console.log(app.globalData.recordValue)
        this.setData({
            recordValue: app.globalData.recordValue
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