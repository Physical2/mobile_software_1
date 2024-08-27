# 2024年夏季《移动软件开发》实验报告



<center>姓名：李佳潼  学号：22020007043</center>

| 姓名和学号？         | 李佳潼，22020007043              |
| -------------------- | -------------------------------- |
| 本实验属于哪门课程？ | 中国海洋大学24夏《移动软件开发》 |
| 实验名称？           | 实验4：媒体API之口述校史小程序   |
| 博客地址？           | XXXXXXX                          |
| Github仓库地址？     | XXXXXXX                          |



## **一、实验目标**

1、掌握视频API的操作方法；

2、掌握如何发送随机颜色的弹幕。

## 二、实验步骤

**1、项目准备**

- **资源准备**

准备一个名为 play 的 png 图片文件，放在 项目文件夹 下新建的 images 文件夹下

![图片文件](D:\DESKTOP\lab4\图片文件.png)

- **项目创建**

创建微信小程序，填入个人的 AppID，使用 JS基础模板

*注：关于微信小程序的注册与第一次使用：*

*① [微信公众平台](https://mp.weixin.qq.com/) 完成用户注册，微信小程序注册、备案相关流程*

*②安装 [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/stable.html)，利用平台信息后获取的小程序 **AppID** 实现连接*

![创建](D:\DESKTOP\lab4\创建.png)

**2、页面配置**

- 根据实验要求完成项目目录的**初始配置**

![初始配置](D:\DESKTOP\lab4\初始配置.png)

**3、视图设计**（*相关介绍已注释在代码中*）

- **index.wxml**

```html
<!-- 页面主要分为三个区域，分别播放视频、编辑&发送弹幕、展示视频列表 -->

<!-- 区域1：视频播放器 -->
<!-- id: 为 video 绑定唯一ID "myViedo"; 
	controls: 启用视频的控制面板; 
	src: 视频URL，通过数据绑定的方式动态设置视频地址; 
	enable-danmu danmu-btn 控制弹幕开启&关闭  -->
<video id="myVideo" controls src="{{ src }}" enable-danmu danmu-btn></video>

<!-- 区域2：弹幕控制 -->
<view class="danmuArea">
<!-- placeholder: 占位符文字，输入框内容为空时显示
	bindinput: 绑定触发 getDanmu 函数获取输入框信息待发送-->
  <input type="text" placeholder="请留下点什么吧~" bindinput="getDanmu"></input>
<!-- bind:tap 绑定触发 sendDanmu 函数发送弹幕信息 -->
  <button bind:tap="sendDanmu">发送弹幕</button>
</view>

<!-- 区域3：视频列表 -->
<view class="videoList">
<!-- wx:for 遍历 list 数组，为每个元素生成一个"videoBar"的视图
	wx:key 为每个视频条目生成唯一的 key，以便更新列表
	data-url 将每个视频的 URL 绑定到当前"videoBar"上，以便在点击时传递给 playVideo 播放函数
	bind:tap 绑定事件，点击某个视频条目时触发 playVideo 播放函数-->
  <view class="videoBar" wx:for="{{ list }}" wx:key="video{{ index }}" data-url="{{ item.videoUrl }}" bind:tap="playVideo">
    <image src="/images/play.png"></image>
    <text>{{ item.title }}</text>
  </view>
</view>
```

- **index.wxss**

```css
video{
  width: 100%;
}

.danmuArea{
  /* 水平排列 */
  display: flex;
  flex-direction: row;
}

input{
  /* 边框宽度&样式&颜色 */
  border: 1rpx solid #987938; 
  /* 扩张多余空间宽度 */
  flex-grow: 1; 
  height: 100rpx;
}

button{
  color: white;
  background-color: #987938;
}

.videoList{
  width: 100%;
  min-height: 400rpx;
}

.videoBar{
  width: 95%;
  display: flex;
  flex-direction: row;
  border-bottom: 1rpx solid #987938;
  margin: 10rpx;
}

image{
  width: 70rpx;
  height: 70rpx;
  margin: 20rpx;
}

text{
  font-size: 45rpx;
  color: #987938;
  margin: 20rpx;
  flex-grow: 1;
}
```

**4、逻辑实现**

- **index.js** (*仅展示改动部分*)

```javascript
  data: {
    danmuTxt: '',
    list: [{
      id: '1001',
      title: '杨国宜先生口述校史实录',
      videoUrl: 
 'http://arch.ahnu.edu.cn/__local/6/CB/D1/C2DF3FC847F4CE2ABB67034C595_025F0082_ABD7AE2.mp4?e=.mp4'
      },
      {
      id: '1002',
      title: '唐成伦先生口述校史实录',
      videoUrl: 
     'http://arch.ahnu.edu.cn/__local/E/31/EB/2F368A265E6C842BB6A63EE5F97_425ABEDD_7167F22.mp4?e=.mp4'
      },
      {
      id: '1003',
      title: '倪光明先生口述校史实录',
      videoUrl: 
     'http://arch.ahnu.edu.cn/__local/9/DC/3B/35687573BA2145023FDAEBAFE67_AAD8D222_925F3FF.mp4?e=.mp4'
      },
      {
      id: '1004',
      title: '吴仪兴先生口述校史实录',
      videoUrl: 
     'http://arch.ahnu.edu.cn/__local/5/DA/BD/7A27865731CF2B096E90B522005_A29CB142_6525BCF.mp4?e=.mp4'
      }
    ]
  },

//getDanmu: 将 input 输入框信息同步到 danmuTxt 
  getDanmu: function (e) {
    this.setData({
      danmuTxt: e.detail.value
    })
  },
      
//sendDanmu: 调用视频上下文 videoCtx 的 sendDanmu 方法，将 弹幕文本 和 随机颜色 (调用 getRandomColor 函数) 发送到视频播放器中显示
  sendDanmu: function (e) {
    let text = this.data.danmuTxt;
    this.videoCtx.sendDanmu({
      text: text,
      color: this.getRandomColor()
    })
  },

//getRandomColor: 随机生成一随机颜色
   getRandomColor: function() {
    let rgb = []
    for(let i = 0; i < 3; ++i){
      //生成一个 0 到 255 之间的随机数，并转换为十六进制字符串
      let color = Math.floor(Math.random() * 256).toString(16)	
      //确保每个颜色值为两位数（在个位数时补零）
      color = color.length == 1 ? '0' + color : color	
      //推入 rgb 数组
      rgb.push(color)
    }
    //将 RGB 数组中的颜色值组合为字符串，并在前面加上 # 号，生成最终的十六进制颜色代码
    return '#' + rgb.join('')
  },

//playVideo: 切换并播放所选的视频
  playVideo: function (e) {
    //停止当前播放的视频
    this.videoCtx.stop()	
    this.setData({
      //更新视频源 src，将视频切换为用户点击的视频条目
      src: e.currentTarget.dataset.url
    })
    console.log(e.currentTarget.dataset.url);
    //播放新的视频
    this.videoCtx.play()
    //延迟 500 毫秒后再次调用播放方法，确保视频顺利播放
    setTimeout(() => {
      this.videoCtx.play();
    }, 500); // 延迟500毫秒
  },

//生命周期函数--监听页面加载，加载时自动调用，初始化视频上下文 videoCtx
  onLoad: function (options) {
    //创建一个视频上下文 videoCtx，并关联到 ID 为 myVideo 的视频组件
    this.videoCtx = wx.createVideoContext('myVideo')
  },
```



## 三、程序运行结果

【初始加载页面】

展示视图设计

![初始加载](D:\DESKTOP\lab4\初始加载.png)

【视频播放】

点击任一视频列表内视频，视窗展示选中视频



![点击播放视频](D:\DESKTOP\lab4\点击播放视频.png)

点击暂停视频



![点击暂停停止播放](D:\DESKTOP\lab4\点击暂停停止播放.png)

点击不同视频实现视频的切换



![点击不同](D:\DESKTOP\lab4\点击不同.png)

【发送弹幕】

输入框中输入任意内容，点击**发送弹幕**，可以看到相应内容附**任意颜色**展示在视频上方

![发送弹幕](D:\DESKTOP\lab4\发送弹幕.png)

## 四、问题总结与体会

描述实验过程中所遇到的问题，以及是如何解决的。有哪些收获和体会，对于课程的安排有哪些建议。

【问题总结】

1、编写 index.wxml 进行视图设计时，使用 image 单标签未生效

```
<image />	(x)
```

解决：通过尝试发现，微信小程序中不支持 image 单标签结束，换用

```
<image>  </image> 
```

【体会】

通过实现视频播放和弹幕等功能，进一步了解多数据展示、数据切换展示、前端数据获取&存储&发布等功能的开发流程，也逐步提高了前端代码编写和解读的能力。