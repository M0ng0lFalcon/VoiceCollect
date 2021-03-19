// miniprogram/pages/index/index.js
var app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        record_class: "weui-btn weui-btn_primary",
        record_text: "开始录音",
        voices: [],
        slideButtons: [{
            text: '删除',
            type: 'warn'
        }, {
            text: '提交',
            type: 'default'
        }],
        recordValue: ""
    },

    touchDown: function () {
        console.log("手指按下")
        this.setData({
            record_class: "weui-btn weui-btn_default",
            record_text: "录音中"
        })

        var _this = this;
        wx.startRecord({
            success: (res) => {
                // 录音文件的临时路径
                var tempFilePath = res.tempFilePath;
                console.log("tempFilePath: " + tempFilePath)

                // 持久保存录音文件
                wx.saveFile({
                    tempFilePath: tempFilePath,
                    success: function (res) {
                        // 保存后的路径
                        var savedFilePath = res.savedFilePath
                        console.log("savedFilePath: " + savedFilePath)

                    }
                })

                // 弹窗提示
                wx.showToast({
                    title: '录音成功',
                    icon: 'success',
                    duration: 1000
                })

                // 获取录音音频列表
                wx.getSavedFileList({
                    success: function (res) {
                        var voices = [];
                        var len = res.fileList.length;
                        for (var i = 0; i < len; i++) {
                            //格式化时间 
                            var createTime = res.fileList[i].createTime
                            //将音频大小B转为KB 
                            var size = (res.fileList[i].size / 1024).toFixed(2);
                            var voice = {
                                filePath: res.fileList[i].filePath,
                                createTime: createTime,
                                size: size,
                                id: i + 1
                            };
                            // console.log("文件路径: " + res.fileList[i].filePath)
                            // console.log("文件时间: " + createTime)
                            // console.log("文件大小: " + size)
                            voices = voices.concat(voice);
                        }
                        _this.setData({
                            voices: voices
                        })
                    }
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
        if(e.detail.index == 0) {
            console.log('del')
        } else {
            console.log('submit')
        }
        console.log(e.detail)
        console.log(e.currentTarget.dataset.key)
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