# 2024年夏季《移动软件开发》实验报告



<center>姓名：李佳潼  学号：22020007043</center>

| 姓名和学号？         | 李佳潼，22020007043                                          |
| -------------------- | ------------------------------------------------------------ |
| 本实验属于哪门课程？ | 中国海洋大学24夏《移动软件开发》                             |
| 实验名称？           | 实验5：高校新闻网                                            |
| 博客地址？           | [实验5：高校新闻网](https://github.com/Physical2/mobile_software_1/tree/master/news_software) |
| Github仓库地址？     | [实验5：高校新闻网小程序](https://blog.csdn.net/m0_73768807/article/details/141830850?spm=1001.2014.3001.5501) |



## **一、实验目标**

1. 综合所学知识创建完整的前端新闻小程序项目；
2. 能够在开发过程中熟练掌握真机预览、调试等操作。



## 二、实验步骤

项目预期实现功能如下：

**首页**

- 首页需要包含轮播图播放效果和新闻列表；
- 轮播图 3 幅图片自动播放（可后期自行添加数量）；
- 点击新闻列表可以跳转查看新闻全文

**新闻页**

- 阅读新闻全文的页面需要显示新闻标题、图片、正文和日期；
- 允许点击按钮将当前阅读的新闻添加到本地收藏夹中；
- 已经收藏过的新闻也可以点击按钮取消收藏

**个人页**

- 未登录状态下显示登录按钮，用户点击以后可以显示微信头像和昵称。
- 登录后读取当前用户的收藏夹，展示收藏的新闻列表。
- 收藏夹中的新闻可以直接点击查看内容。
- 未登录状态下收藏夹显示为空

#### 【**实验准备**】

**项目创建**

创建微信小程序，填入个人的 AppID、不使用云服务、 JS基础模板

*另：上述选择为最基础模板，可根据项目需求自行选择*

*注：关于微信小程序的注册与第一次使用：*

*① [微信公众平台](https://mp.weixin.qq.com/) 完成用户注册，微信小程序注册、备案相关流程*

*②安装 [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/stable.html)，利用平台信息后获取的小程序 **AppID** 实现连接*

![创建](D:\DESKTOP\lab5\record\创建.png)



**项目文件整理**

对已有初始化文件的整理如下

![初始化](D:\DESKTOP\lab5\record\初始化.png)

![初始化1](D:\DESKTOP\lab5\record\初始化1.png)

![初始化2](D:\DESKTOP\lab5\record\初始化2.png)

其他文件的创建与添加

1. 在项目总目录下添加images、utils两文件夹

   ![初始化3](D:\DESKTOP\lab5\record\初始化3.png)

2. 添加底部导航栏相关图片及命名如下

   ![初始化4](D:\DESKTOP\lab5\record\初始化4.png)

3. 添加新闻文章用到的展示图片

*如果新闻图片非本地，则不需要添加到目录中*



整理后项目目录如下

![目录](D:\DESKTOP\lab5\record\目录.png)



#### 【**视图设计**】

项目共展示三个页面：首页、个人页、新闻详细页（将分别展示代码以及对应页面划分）

*注：此处不繁杂展示 .wxss 文件内容，有需要的伙伴可前往 github 查看*

**设置顶部、底部导航栏（注释在使用代码时删除）**

```json
//app.json
//顶部导航栏
"window": {
    "navigationBarTextStyle": "white",
    "navigationBarTitleText": "我的新闻网",
    "navigationBarBackgroundColor": "#328EEB"
  },
//底部导航栏（按照list中顺序显示）
  "tabBar": {
    "color": "#000",
    "selectedColor": "#328EEB",
    "list": [
      {
        //对应跳转页面
        "pagePath": "pages/index/index",
        //未选中时展示的图片标识
        "iconPath": "images/index.png",
        //选中时展示的图片标识
        "selectedIconPath": "images/index_blue.png",
        "text": "首页"

      },
      {
        "pagePath": "pages/my/my",
        "iconPath": "images/my.png",
        "selectedIconPath": "images/my_blue.png",
        "text": "我的"
      } 
    ]
  },
```

则有分别选中 “首页” 和 “我的” 样式如下

![tab](D:\DESKTOP\lab5\record\tab.png)

![tab1](D:\DESKTOP\lab5\record\tab1.png)

**首页**

```html
<!-- index.wxml -->
<!-- 轮播图 -->

<swiper indicator-dots autoplay interval="5000" duration="500">
  <block wx:for="{{swiperImg}}" wx:key="swiper((index))">
    <swiper-item>
      <image src="{{item.src}}" class="slide-image"/>
    </swiper-item>
  </block>
</swiper>
```

-  **indicator-dots** 是否显示面板指示点 
-  **autoplay** 是否自动切换 
-  **interval** 自动切换的时间间隔，单位为毫秒（ms） 
-  **duration** 滑动动画的时长，单位为毫秒（ms）



```html
<!-- 新闻列表 -->
<view id="news-list">
  <view class="list-item" wx:for="{{newsList}}" wx:for-item="news" wx:key="{{news.id}}">
      <image src="{{news.poster}}"></image>
      <text bind:tap="goToDetail" data-id="{{news.id}}">◇{{news.title}}——{{news.add_date}}</text>
    </view>
</view>
```

- 遍历 newsList 数组内容并为每一组数据生成一个新的 view 列表项

- 绑定 goToDetail 函数，用于点击跳转新闻详情页

编写完成后页面展示及划分如下

![首页](D:\DESKTOP\lab5\record\首页.png)

**个人页**

```html
<!-- 微信用户登录 --> 
<view id="myLogin">   
  <block wx:if="{{isLogin}}">
    <image id="myIcon" src="{{src}}"></image>
    <text id="nickName">{{nickName}}</text>
  </block>
  <button wx:else open-type="getUserInfo" bindgetuserinfo="getMyInfo">未登录，点此登录</button>
</view>
```

- getUserInfo: 微信开发自带函数，用于获取微信用户信息

```html
<!-- 收藏列表 --> 
<view id="myFavorites">
  <text>我的收藏{{num}}</text>
  <view id="news-list">
    <view class="list-item" wx:for="{{newsList}}" wx:for-item="news" wx:key="{{news.id}}">
      <image src="{{news.poster}}"></image>
      <text bind:tap="goToDetail" data-id="{{news.id}}">◇{{news.title}}——{{news.add_date}}</text>
    </view>
  </view>
</view>
```

- num:  展示收藏文章总数
- 展示文章列表部分样式与 首页 部分一致

编写完成后页面展示及划分如下

【登录前】

![个人页](D:\DESKTOP\lab5\record\个人页.png)

【登录后】

![个人页1](D:\DESKTOP\lab5\record\个人页1.png)

**详情页**

```html
<view class="container">
  <!-- 文章标题 --> 
  <view class="title">{{article.title}}</view>
  <!-- 文章图片 --> 
  <view class="poster">
    <image src="{{article.poster}}" mode="widthFix"></image>
  </view>
  <!-- 文章内容 --> 
  <view class="content">{{article.content}}</view>
   <!-- 文章发布时间 --> 
  <view class="add_date">时间: {{article.add_date}}</view>
  <!-- 文章收藏 --> 
  <button wx:if="{{isAdd}}" plain bind:tap="cancelFavorites">❤已收藏</button>
  <button wx:else plain bind:tap="addFavorites">❤点击收藏</button>
</view>
```

- mode="widthFix" 图片适应父容器宽度
- cancelFavorites  从收藏列表删除
-  addFavorites  添加到收藏列表

编写完成后页面展示及划分如下

![详情页](D:\DESKTOP\lab5\record\详情页.png)

![详情页1](D:\DESKTOP\lab5\record\详情页1.png)



#### 【**逻辑实现**】

*注仅在初始化文件基础上添加or修改，其余默认内容保留*

1、**/utils/common.js**  

```javascript
//模拟新闻数据
const news = [
  {id: '264698',
  title: '中国海大志愿者完成第五届跨国公司领导人青岛峰会志愿服务',
  poster: '/images/newsimage1.jpg',
  content: '文章1内容',
  add_date: '2024-08-31'},

  {id: '304083',
  title: '贵州省人大干部综合能力提升培训班在中国海洋大学举办',
  poster: '/images/newsimage2.jpg',
  content: '文章2内容',
  add_date: '2024-08-30'},

  {id: '305670',
  title: '中国海洋大学开展2024级本科生集中入学教育',
  poster: '/images/newsimage3.jpg',
  content: '文章3内容',
  add_date: '2024-08-29'}
];
```



```javascript
//获取新闻列表，放在 list 数组中返回
function getNewsList() {
  let list = [];
  for (var i = 0; i < news.length; i++) {
    let obj = {};
    obj.id = news[i].id;
    obj.poster = news[i].poster;
    obj.add_date = news[i].add_date;
    obj.title = news[i].title;
    list.push(obj);
  }
  return list; //返回新闻列表
}
```



```javascript
//输入参数newID，获取新闻内容返回到 msg 中
function getNewsDetail(newsID) {
  let msg = {
    code: '404', //没有对应的新闻
    news: {}
  };
  for (var i = 0; i < news.length; i++) {
    if (newsID == news[i].id) { //匹配新闻id编号
      msg.code = '200'; //成功
      msg.news = news[i]; //更新当前新闻内容
      break;
    }
  }
  return msg; //返回查找结果
}
```



```javascript
// 对外暴露接口
module.exports = {
  getNewsList: getNewsList,
  getNewsDetail: getNewsDetail
}
```



2、**/pages/index/index.js**

```javascript
var common = require('../../utils/common')	//引入common.js
Page({

  data: {
    swiperImg:[
      {src: "/images/newsimage1.jpg"},
      {src: "/images/newsimage2.jpg"},
      {src: "/images/newsimage3.jpg"}
    ],
  },
    
  //根据 id 跳转到详情页展示对应文章内容
  goToDetail: function(e){
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../detail/detail?id=' + id	//带得到的 id 参数跳转
    })
  },

  //页面加载时自动更新文章列表
  onLoad: function (options) {
    //获取新闻列表
    let list = common.getNewsList()
    //更新列表数据
    this.setData({
      newsList: list
    })
  },
    
})
```

3、**/pages/detail/detail.js**

```javascript
var common = require('../../utils/common')	//引入common.js
Page({

  data: {
    num: 0,
    article: {}
  },

  //文章添加到收藏（wx.setStorageSync）
  addFavorites: function (options) {
    let article = this.data.article;
    wx.setStorageSync(article.id, article);
    this.setData({
      isAdd: true	//是否为收藏的判断标志
    });
  },

  //文章从收藏删除（wx.removeStorageSync）
  cancelFavorites: function () {
    let article = this.data.article;
    wx.removeStorageSync(article.id);
    this.setData({
      isAdd: false
    });
  },

  //页面初加载时根据传参 id 返回对应文章 article
  onLoad: function(options) {
    let id = options.id
    // console.log("得到的id是：",id);
    var article = wx.getStorageSync(id)
    if(article != ''){
      this.setData({
        article: article,
        isAdd: true
      })
    }else{
      let result = common.getNewsDetail(id)
      if(result.code == '200'){
        this.setData({
          article: result.news,
          isAdd: false
        })
        // console.log("返回数据",result.news.title, result.news.add_date)
      } 
    }
  },
  
})
```





4、**/pages/my/my.js**

```javascript
var common = require('../../utils/common')	//引入common.js
Page({

  data: {
    nickName: "未登录",
    src: '/images/index.png',
    num: 0,
 
  },
    
  //微信用户获取&查看
  getMyInfo: function (e) {
    let info = e.detail.userInfo;
    this.setData({
      isLogin: true,
      src: info.avatarUrl,
      nickName: info.nickName
    })
    // console.log(e.detail.userInfo)
    this.getMyFavorites();
  },
  
  //从本地存储中获取收藏列表，以 myList 返回，并更新收藏数量 num 
  getMyFavorites: function () {
    let info = wx.getStorageInfoSync();
    let keys = info.keys;
    let num = keys.length;

    let myList = [];
    for(var i = 0; i < num; i++){
      let obj = wx.getStorageSync(keys[i]);
      myList.push(obj);
    }
    this.setData({
      newsList: myList,
      num: num
    })
  },
    
  //根据 id 跳转到详情页展示对应文章内容（同 index.js ）
  goToDetail: function(e){
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../detail/detail?id=' + id
    })
  },


  //页面加载时自动更新收藏文章列表
  onShow: function() {
    if(this.data.isLogin){
      this.getMyFavorites()
    }
  },

})
```



## 三、程序运行结果

*注：以下页面为 gif 动图，具体过程见博客*

**微信用户登录**

已在**视图设计**部分展示

**首页轮播图展示**

![轮播图](D:\DESKTOP\轮播图.gif)



**首页点击任一文章跳转详情页**

![点击详情](D:\DESKTOP\点击详情.gif)



**详情页收藏功能**

![收藏](D:\DESKTOP\收藏.gif)





点击收藏后可以在 Storage部分查看到存储

![storage](D:\DESKTOP\lab5\record\storage.png)



**收藏&查看&取消收藏**



![收藏1](D:\DESKTOP\收藏1.gif)



## 四、问题总结与体会

【问题总结】

1. 对实验文档中 image 显示问题的思考

   由于在本地编写时尝试设置 width: 100% 后未出现描述情况，故猜测可能原因为父容器（ poster ）宽度未设置问题，设置百分比宽度需要父容器有固定的宽度才能正常展示

2. 详情页添加如下代码时未成功展示文章标题

```html
<view class="title">{{article.title}}</view>
```

解决：

- 首先在 detail.js 的 onLoad函数中添加如下代码查看 get 到的数据是否正确

```javascript
let id = options.id
// console.log("得到的id是：",id);
...
if(result.code == '200'){
        this.setData({
          article: result.news,
          isAdd: false
        })
        // console.log("返回数据",result.news.title, result.news.add_date)
      } 
```

结果成功返回 title、add_date等参数

- 重新查看前端代码内容，发现将 “title” 错写成 "titel"

修改之后编译发现仍未展示

- 清缓存

解决 √

【体会】

本项目实现了轮播图展示、文章列表获取与指定展示、文章收藏与取消收藏功能，进一步了解了多数据展示、数据切换展示、页面传参切换、数据本地存储等实际需求的实现

学会了通过控制台打印 console.log("注释", 返回数据) ，自主查看文件报错的原因所在，进一步提高了前后端开发的能力