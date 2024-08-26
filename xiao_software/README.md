# 2024年夏季《移动软件开发》实验报告



<center>姓名：李佳潼 &nbsp;&nbsp;&nbsp;  学号：22020007043</center>

| 姓名和学号?          | 李佳潼，22020007043                                          |
| -------------------- | ------------------------------------------------------------ |
| 本实验属于哪门课程？ | 中国海洋大学24夏《移动软件开发》                             |
| 实验名称？           | 实验1：第一个微信小程序                                      |
| 博客地址？           | [移动软件开发_lab1-CSDN博客](https://blog.csdn.net/m0_73768807/article/details/141329462?spm=1001.2014.3001.5502) |
| Github仓库地址？     | [Physical2/mobile_software_1 (github.com)](https://github.com/Physical2/mobile_software_1) |

（备注：将实验报告发布在博客、代码公开至 github 是 **加分项**，不是必须做的）



## **一、实验目标**

1、学习使用快速启动模板创建小程序的方法；2、学习不使用模板手动创建小程序的方法。



## 二、实验步骤

### 实验准备

登录 **微信公众平台** 进行用户注册和微信小程序注册、备案等流程；

安装 **微信开发者工具**，利用在平台完善信息后获取的小程序 **AppID** 将注册的小程序在工具中打开；

### 代码实现

针对实验要求，分别编写相应文件内容

**app.json**

*实现导航栏颜色、文字的调整*

```json
  "window": {
    "backgroundColor": "#ffffff",
    "backgroundTextStyle": "light",
    "navigationBarBackgroundColor": "#663399",	//导航栏背景为紫色
    "navigationBarTitleText": "手动创建第一个",	//导航栏内容
    "navigationBarTextStyle": "black"	//文字为黑色
  },
```

**index.wxml**

*实现主页内容框架，确定预使用的组件*

```html
<view class="container">
  <view  class="showUserInfo">
    <image class="showUserImg" src='{{userInfo.avatarUrl}}'mode='widthFix'/>
    <text class="showUserName">{{userInfo.nickName}}</text>
  </view>
  
  <button open-type='getUserProfile' bindtap='getUserProfile' class="button_1">
    点击获取头像和昵称
  </button>
</view>
```

**index.wxss**

*对主页各组件样式进行调整，使用类选择器、标签名选择器等，使页面简洁直观*

```css
.container{
  height: 90vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
}

.button_1{
  width: 80%;
  margin-top: -10%;
}

.showUserInfo{
  display: flex;
  flex-direction: column;
  align-items: center;
}

.showUserName{
  margin-top: 10%;
}

.showUserInfo image{
  width: 300rpx;
  border-radius: 50%;
}
```

**index.js**

*实现点击按钮获取用户信息并匹配到 userInfo 的函数功能*

~~~javascript
Page({
  data: {
    userInfo: {
      avatarUrl: '../../images/avatar.png',		//默认头像
      nickName: '匿名用户',		//默认名称
    },
    hasUserInfo: false,		//用于后续对无用户的情况进行单独测试
  },
 
getUserProfile: function(e){
  wx.getUserProfile({
    desc: '用于完善用户信息',
    success: (result) => {
      console.log(result);
      this.setData({
        userInfo: result.userInfo,	//将用户信息更新为获取后的用户信息
        hasUserInfo: true,
      })
    },
    fail: () => {
      wx.showToast({
        title: '授权失败',
      });
      this.setData({
        hasUserInfo: true,
      })
    },
    complete: (res) => {},
  })
}
  
});
~~~



## 三、程序运行结果

**初始编译小程序时，展示默认信息**

![默认](D:\DESKTOP\移动软件开发\lab1\默认.png)

**点击 “点击获取头像和昵称” 提示按钮后展示获取信息**

![请求](D:\DESKTOP\移动软件开发\lab1\请求.png)

![获取后](D:\DESKTOP\移动软件开发\lab1\获取后.png)

**同时控制台打印 userInfo 的相关信息**

![userInfo](D:\DESKTOP\移动软件开发\lab1\userInfo.png)

## 四、问题总结与体会

【**问题总结**】

1、实验文档中提到的 getUserInfo 函数无法正常获取到信息

**解决：改用 getUserProfile 函数，并使用 tap 绑定函数实现点击获取功能**

2、针对用户信息无法对真实用户获取，只能获取默认的 “微信用户” 信息

**解决：调低开发环境版本至 2.18.1，重新编译成功实现获取功能**

【**实验体会**】

通过本次实验，我掌握了开发微信小程序的基本初始步骤，了解了基本开发框架与相应的文件功能，也认识到微信小程序开发与网站开发、软件开发的异同点，体会到了不同开发框架的区别与联系

