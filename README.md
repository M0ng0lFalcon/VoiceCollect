# 机器人与物联网常用语音控制指令采集系统 小程序端

## 一、代码简介

1. 入口页面：index
2. 个人主页：home
3. 录音界面：record

### 1.1 index

#### index.wxml

通过对`textLi`数组进行遍历展示数据列表

#### index.js

`db.collection("VoiceData").get()` 用来获取数据库当中的数据

### 1.2 home

#### home.wxml

通过对 `isHide` 变量来判断是否已经授权登录

#### home.js

当页面载入的时候运行 `onLoad` 函数

`wx.getSetting()` 函数查看是否授权

`wx.login()` 函数获取用户 code

`wx.request()` 函数通过调用官方接口来获取 openid

获取 openid 之后判断数据库里是否有该用户，如果没用就创建一个

`bindGetUserInfo()` 授权登录

### 1.3 record

#### record.wxml

展示待录音的文字信息，以及一个录音按钮

#### record.js

`wx.startRecord()` 当按钮按住的时候开始录音

`wx.stopRecord()` 手指抬起的时候停止录音

`slideBtnTap()` 滑动按钮触发事件

`wx.cloud.uploadFile()` 上传到云存储


