var app = getApp()
const db = wx.cloud.database()
Page({
    data: {
        //判断小程序的API，回调，参数，组件等是否在当前版本可用。
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        isHide: false,
        list: [{
                listName: '列表1',
                item: [{
                    itemName: '子列表1-1',
                    content: '1-1中的内容',
                    time: '2015-05-06'
                }, {
                    itemName: '子列表1-2',
                    content: '1-2中的内容',
                    time: '2015-04-13'
                }, {
                    itemName: '子列表1-3',
                    content: '1-3中的内容',
                    time: '2015-12-06'
                }]
            },
            {
                listName: '列表2',
                item: [{
                    itemName: '子列表2-1',
                    content: '2-1中的内容',
                    time: '2017-05-06'
                }, {
                    itemName: '子列表2-2',
                    content: '2-2中的内容',
                    time: '2015-08-06'
                }, {
                    itemName: '子列表2-3',
                    content: '2-3中的内容',
                    time: '2015-11-06'
                }]
            }, {
                listName: '列表3',
                item: [{
                    itemName: '子列表3-1',
                    content: '3-1中的内容',
                    time: '2015-05-15'
                }, {
                    itemName: '子列表3-2',
                    content: '3-2中的内容',
                    time: '2015-05-24'
                }, {
                    itemName: '子列表1-3',
                    content: '3-3中的内容',
                    time: '2015-05-30'
                }]
            }
        ]
    },

    listTap(e) {
        console.log('触发了最外层');
        let Index = e.currentTarget.dataset.parentindex, //获取点击的下标值
            list = this.data.list;
        list[Index].show = !list[Index].show || false; //变换其打开、关闭的状态
        if (list[Index].show) { //如果点击后是展开状态，则让其他已经展开的列表变为收起状态
            this.packUp(list, Index);
        }

        this.setData({
            list
        });
    },
    //点击里面的子列表展开收起
    listItemTap(e) {
        let parentindex = e.currentTarget.dataset.parentindex, //点击的内层所在的最外层列表下标
            Index = e.currentTarget.dataset.index, //点击的内层下标
            list = this.data.list;
        console.log(list[parentindex].item, Index);
        list[parentindex].item[Index].show = !list[parentindex].item[Index].show || false; //变换其打开、关闭的状态
        if (list[parentindex].item[Index].show) { //如果是操作的打开状态，那么就让同级的其他列表变为关闭状态，保持始终只有一个打开
            for (let i = 0, len = list[parentindex].item.length; i < len; i++) {
                if (i != Index) {
                    list[parentindex].item[i].show = false;
                }

            }
        }
        this.setData({
            list
        });
    },
    //让所有的展开项，都变为收起
    packUp(data, index) {
        for (let i = 0, len = data.length; i < len; i++) { //其他最外层列表变为关闭状态
            if (index != i) {
                data[i].show = false;
                for (let j = 0; j < data[i].item.length; j++) { //其他所有内层也为关闭状态
                    data[i].item[j].show = false;
                }
            }
        }
    },

    onLoad: function () {
        var that = this;
        // 查看是否授权
        wx.getSetting({
            success: function (res) {
                if (res.authSetting['scope.userInfo']) {
                    wx.getUserInfo({
                        success: function (res) {
                            // 用户已经授权过,不需要显示授权页面,所以不需要改变 isHide 的值
                            // 根据自己的需求有其他操作再补充
                            // 我这里实现的是在用户授权成功后，调用微信的 wx.login 接口，从而获取code
                            wx.login({
                                success: res => {
                                    // 获取到用户的 code 之后：res.code
                                    console.log("用户的code:" + res.code);

                                    // 可以传给后台，再经过解析获取用户的 openid
                                    // 或者可以直接使用微信的提供的接口直接获取 openid ，方法如下：
                                    wx.request({
                                        // 自行补上自己的 APPID 和 SECRET
                                        url: 'https://api.weixin.qq.com/sns/jscode2session?appid=wxff581adaf547f954&secret=3731bd75ab63cbf6d501563528a3e0a1&js_code=' + res.code + '&grant_type=authorization_code',
                                        success: res => {
                                            // 获取到用户的 openid
                                            // console.log("用户的openid:" + res.data.openid);
                                            app.globalData.openId = res.data.openid
                                        }
                                    });
                                    
                                    db.collection('Users').where({
                                        data: {
                                            _openid: app.globalData.openId
                                        }
                                    }).get({
                                        success: function (res) {
                                            console.log("用户查询结果", res.data)
                                            if(res.data.length == 0) {
                                                db.collection('Users').add({
                                                    data: {
                                                        _openid: app.globalData.openId,
                                                        voices: []
                                                    },
                                                    success: function(res) {
                                                        console.log(res)
                                                    }
                                                })
                                            }
                                        }
                                    })
                                }
                            });
                        }
                    });
                } else {
                    // 用户没有授权
                    // 改变 isHide 的值，显示授权页面
                    that.setData({
                        isHide: true
                    });
                }
            }
        });
    },

    bindGetUserInfo: function (e) {
        if (e.detail.userInfo) {
            //用户按了允许授权按钮
            var that = this;
            // 获取到用户的信息了，打印到控制台上看下
            console.log("用户的信息如下：");
            console.log(e.detail.userInfo);
            //授权成功后,通过改变 isHide 的值，让实现页面显示出来，把授权页面隐藏起来
            that.setData({
                isHide: false
            });
        } else {
            //用户按了拒绝按钮
            wx.showModal({
                title: '警告',
                content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
                showCancel: false,
                confirmText: '返回授权',
                success: function (res) {
                    // 用户没有授权成功，不需要改变 isHide 的值
                    if (res.confirm) {
                        console.log('用户点击了“返回授权”');
                    }
                }
            });
        }
        this.onLoad()
    }
})