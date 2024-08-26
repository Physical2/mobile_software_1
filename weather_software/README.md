# 2024年夏季《移动软件开发》实验报告



<center>姓名：李佳潼  学号：22020007043</center>

| 姓名和学号？         | 李佳潼，22020007043                                          |
| -------------------- | ------------------------------------------------------------ |
| 本实验属于哪门课程？ | 中国海洋大学24夏《移动软件开发》                             |
| 实验名称？           | 实验2：天气查询小程序                                        |
| 博客地址？           | [实验2 天气小程序](https://blog.csdn.net/m0_73768807/article/details/141365396?spm=1001.2014.3001.5502) |
| Github仓库地址？     | [实验2 天气小程序](https://github.com/Physical2/mobile_software_1/tree/master/weather_software) |

## **一、实验目标**

1、学习使用快速启动模板创建小程序的方法；2、学习不使用模板手动创建小程序的方法。

## 二、实验步骤

### 实验准备

#### 创建新项目

打开 **微信开发者工具** 添加小程序，选用  **JS基础模板**，并按照实验要求进行框架整理

- 将 app.json 文件内 pages 属性中的 “pages/logs/logs” 删除,并删除上一行末尾的
  逗号；
- 将 app.json 文件内 pages 属性中的 “pages/logs/logs” 删除,并删除上一行末尾的
  逗号；
- 删除 utils 文件夹及其内部所有内容
- pages 文件夹下的 logs 目录及其内部所有内容
- index.wxml 和 index.wxss 中的全部代码
- index.js 中的全部代码（恢复 Page 自动补全代码）
- app.wxss 中的全部代码
- app.js 中的全部代码（恢复 App 自动补全代码）

#### 服务器域名配置

在使用 wx.**request** 获取 API 内容前，需对 API 进行 相应的域名配置

打开小程序管理平台 https://mp.weixin.qq.com 在**开发管理** 位置找到下方展示位置添加 **request 合法域名**

*本次用到以下两个域名，配置如下*

![域名配置](D:\DESKTOP\移动软件开发\lab2\域名配置.png)

#### 小程序图片展示

 [和风天气图标获取](https://dev.qweather.com/docs/resource/icons/) 

将获取的天气图片压缩包添加到 **images** 文件夹下 **weather_icon** 文件夹内，以便后续获取

### 代码实现

针对实验要求，分别编写相应文件内容

**app.json**（修改部分）

*实现导航栏颜色、字体、字内容修改*

```json
"window": {
    "navigationBarTextStyle": "white",
    "navigationBarTitleText": "今日天气",	//导航栏文字
    "navigationBarBackgroundColor": "#3883FA"	//背景调为蓝色
  },
```

**index.wxml**

*确定页面使用组件以及大体框架*

该实验主页面主要分为：城市区域展示&选择、天气状态展示、详细数据展示

```html
<div class="container">
  
  <!-- 城市区域展示 -->
  <picker mode="region" bindchange="regionChange">
    <view>{{region}}</view>
  </picker>
  
  <!-- 城市温度、天气展示 -->
  <text>{{now.temp}}℃ {{now.text}}</text>
  <image src="/images/weather_icon/{{now.icon}}.svg" mode="widthFix"></image>
  
  <!-- 详细数据展示 -->
  <view class="detail">
    <view class="bar">
      <view class="box">湿度</view>
      <view class="box">气压</view>
      <view class="box">能见度</view>
    </view>
    <view class="bar">
      <view class="box">{{now.humidity}} %</view>
      <view class="box">{{now.pressure}} hpa</view>
      <view class="box">{{now.vis}} km</view>
    </view>
    <view class="bar">
      <view class="box">风向</view>
      <view class="box">风速</view>
      <view class="box">风力</view>
    </view>
    <view class="bar">
      <view class="box">{{now.windDir}}</view>
      <view class="box">{{now.windScale}} km/h</view>
      <view class="box">{{now.windSpeed}} 级</view>
    </view>
  </view>
</div>
```

**index.wxss**

*使用类选择器、标签选择器等调整页面布局*

*整体按列排布、居中显示、详细数据部分按行展示*

```css
.container{
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
}

text{
  font-size: 80rpx;
  color: #3c5F81;
}

image{
  width: 220rpx;
}

.detail{
  width: 100%;
  display: flex;
  flex-direction: column;
}

.bar{
  display: flex;
  flex-direction: row;
  margin: 20rpx 0;
}

.box{
  width: 33.3%;
  text-align: center;
}
```

**index.js**（修改部分）

*实现小程序 获取天气相关数据 功能，具体各部分功能如下*

（我的 key 为 e930091cdf5d41f59f28a6387d3b182f，将只在实验报告、github 源码中体现）

```javascript
Page({
//定义 region locationId now 变量，并确定默认数据
  data: {
    region: ['山东省',' 青岛市',' 黄岛区'],
    locationId: '',
    now: {
      temp: 0,
      text: "未知",
      icon: "999",
      humidity: 0,
      pressure: 0,
      vis:0,
      windDir: 0,
      windScale: 0,
      windSpeed: 0
    }
  },

//绑定在 picker 上，实现天气数据随选定地区而变，每选择一次地区重新调用一次 getNow 函数获取天气
  regionChange: function(e){
    this.setData({region: e.detail.value});
    this.getNow();
  },
    
//getNow: 利用 locationId 调用getWeather()，获取实时天气
  getNow: function () {
    var that = this;
    wx.request({
      url: 'https://geoapi.qweather.com/v2/city/lookup?',
      data:{
        location:that.data.region[1],	//location放入 region 变量的区域数据
        key: '这里放上自己的key'
      },
      success: function (res) {
        console.log("location获取",res.data.location[0].id);
        //如果状态码为 200 即成功返回且数据不为空
        if (res.data.code === "200" && res.data.location.length > 0) {	
          that.setData({
            locationId: res.data.location[0].id
          });
          that.getWeather();
        }else{
          console.log("请求失败");
        }
      }
    })
  },
//getWeather: 根据最新的 locationId 获取天气数据放在 data 的 now 变量中
  getWeather: function(){
    var that = this;
    wx.request({
      url: 'https://devapi.qweather.com/v7/weather/now?',
      data:{
        location: that.data.locationId,
        key: '这里放上自己的key'
      },
      success: function (res) {
        console.log(res.data);
        that.setData({now: res.data.now});
      }
    })
  },

//生命周期函数--监听页面加载，即加载时便自动调用 getNow 函数
  onLoad: function (options) {
    this.getNow();
  },
```

## 三、程序运行结果

**默认情况下展示初始的 now 数据**

![默认](D:\DESKTOP\移动软件开发\lab2\默认.png)

**点击城市区域后可选择想要获取天气实况的城市**

![picker](D:\DESKTOP\移动软件开发\lab2\picker.png)

**选择城市后，展示获取到城市的天气状况**

![之后](D:\DESKTOP\移动软件开发\lab2\之后.png)

**同时控制台分别打印获取的位置 ID 和对应的实时天气数据（now）**

![get](D:\DESKTOP\移动软件开发\lab2\get.png)

## 四、问题总结与体会

【**问题总结**】

1、API 存在改动，使用之前的 API 无法成功响应

**解决：查找新的 API（实验步骤中已给出）进行替换**

2、更新 API 后 **location** 变量限制为 **经纬度/位置ID**，无法直接通过页面选择的位置信息进行获取

**解决：index.js 中添加 getNow 函数，利用 geoAPI 获取位置 ID 之后调用 getWeather 函数**

【**实验体会**】

通过本次实验，掌握了小程序的创建、域名配置等操作，熟悉了利用 request 调取数据的基本流程以及调试，也为后续实验打下了基础