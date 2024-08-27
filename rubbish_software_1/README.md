# 2024年夏季《移动软件开发》实验报告



<center>姓名：李佳潼&nbsp;&nbsp;&nbsp;学号：22020007043</center>

| 姓名和学号？         | 李佳潼，22020007043                                          |
| -------------------- | ------------------------------------------------------------ |
| 本实验属于哪门课程？ | 中国海洋大学24夏《移动软件开发》                             |
| 实验名称？           | 实验3：云开发之垃圾分类小程序                                |
| 博客地址？           | [实验3：云开发之垃圾分类小程序](https://blog.csdn.net/m0_73768807/article/details/141573747?spm=1001.2014.3001.5501) |
| Github仓库地址？     | [实验3：云开发之垃圾分类小程序](https://github.com/Physical2/mobile_software_1) |

【简要介绍】

本项目基于 **微信云开发服务，**利用**云数据库**、**云函数**等小程序云开发技术进行 **后端部署** 以及 **前后端连接与展示**

【学习链接】

[微信小程序云开发以及云开发实例展示 ](https://developers.weixin.qq.com/community/develop/article/doc/0008aa90bc4e68c6a39f8b7e956813)

[垃圾分类小程序 Gitee](https://gitee.com/xxwan/garbage-sorting-applet)

## **一、实验目标**

1、学习微信小程序云开发的基础知识。完成利用文本搜索的功能

## 二、实验步骤

实验主要分为 **实验准备**、**后端部署**、**前端关键代码解读** 三部分

- ### 实验准备


**1、项目创建**

创建本地文件夹，打开**Git bash**，输入以下命令完成**项目克隆**

```
git clone git@gitee.com:xxwan/garbage-sorting-applet.git
```

将本地的目标文件夹**导入微信开发者小程序**

*注：关于微信小程序的注册与第一次使用：*

*① [微信公众平台](https://mp.weixin.qq.com/) 完成用户注册，微信小程序注册、备案相关流程*

*②安装 [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/stable.html)，利用平台信息后获取的小程序 **AppID** 实现连接*

![导入项目](D:\DESKTOP\lab3\导入项目.png)

后端服务选择**微信云开发**（这里我已创建云开发环境，所以未展示不选择云服务选项）

**AppID**：选择开发者注册获得的AppID

![创建](D:\DESKTOP\lab3\创建.png)

2、百度智能云创建**图像识别应用**、记录**API Key**和**Secret Key**

[百度云注册&实名认证（这里完成后可直接跳转创建应用）](https://console.bce.baidu.com/ai/?_=&fromai=1#/ai/imagerecognition/app/create)，输入名称后**立即创建**

![百度应用创建](D:\DESKTOP\lab3\百度应用创建.png)

从**应用列表**中可以查看用户已注册应用，并根据应用名称找到对应应用，保存对应**API Key**和**Secret Key**（之后会用到）

![百度key](D:\DESKTOP\lab3\百度key.png)

- ### 数据库&后端部署


进入**云开发**控制台（第一次使用会出现弹窗，确认后自动创建云开发环境）

![云开发](D:\DESKTOP\lab3\云开发.png)

进入**数据库**视窗并创建**trash**、**type**集合

![云开发控制台](D:\DESKTOP\lab3\云开发控制台.png)

![数据库集合](D:\DESKTOP\lab3\数据库集合.png)

**导入**数据库，分别在trash、type集合中导入trash.json、type.json（这里的**环境ID**记得保存）

![导入数据库](D:\DESKTOP\lab3\导入数据库.png)

*导入成功后可以在数据库中看到相关数据*

![导入成功](D:\DESKTOP\lab3\导入成功.png)

![导入成功_2](D:\DESKTOP\lab3\导入成功_2.png)

最后点击**概览**记录**环境ID**（导入json文件时也可以保存）

![环境ID](D:\DESKTOP\lab3\环境ID.png)

- ### 前端连接与实现

**连接**

添加**API Key**和**Secret Key**

![百度key (2)](D:\DESKTOP\lab3\百度key (2).png)

添加**AppID**

![AppID](D:\DESKTOP\lab3\AppID.png)

添加**环境ID**

![环境ID (2)](D:\DESKTOP\lab3\环境ID (2).png)

对 **cloudfunctions** 下每个文件夹， 右键 **上传并部署：云端安装依赖**

![Og5hX6](D:\DESKTOP\lab3\Og5hX6.png)

**实现**

*这里主要分析与云开发相关的搜索界面及功能，即 **search.js**、**search.wxml***

【热门搜索&文字搜索】

点击相关标签 / 输入框中输入文字 -> 调用绑定的 **doClickHotItem** 函数 -> 判断内容是否有效 -> 清空历史搜索项&展示加载中界面（由 **showLoading** 控制）-> 在相关垃圾类型中搜索 -> 隐藏加载界面（**hideLoading**） -> 若未搜索到，showToast 提示 “暂时搜索不到” ；若搜索到则展示数据相关内容

【图像识别搜索】

点击**扫描样式**按钮 -> 调用 **doClickCamera** 函数 -> 授权相机使用 -> 获取 **BaiduToken** ->  读取图片文件 **wx.getFileSystemManager().readFile** 并对扫描图片物品调用 **scanImageInfo** 进行扫描 ->对选择的标签进行同【热门搜索&文字搜索】的搜索，获取结果

## 三、程序运行结果

搜索页原始样式

![搜索页_原始](D:\DESKTOP\lab3\搜索页_原始.png)

【热门搜索】

点击热门搜索标签，调用函数，显示加载中界面

![点击热门搜索加载](D:\DESKTOP\lab3\点击热门搜索加载.png)

搜索到数据，展示成功

![展示](D:\DESKTOP\lab3\展示.png)

【文字搜索】

输入 “香蕉皮”， 调用函数，显示加载中界面

![自主搜索加载](D:\DESKTOP\lab3\自主搜索加载.png)

搜索到数据，展示成功

![自主搜索展示](D:\DESKTOP\lab3\自主搜索展示.png)

控制台返回也可以看到相关数据

![返回数据](D:\DESKTOP\lab3\返回数据.png)

![自主返回数据](D:\DESKTOP\lab3\自主返回数据.png)

【图片搜索】

点击**搜索样式**按钮，弹出**是否允许使用摄像头**请求，确认后选择文件

![图像](D:\DESKTOP\lab3\图像.png)

得到识别结果，自主选择后进入 文字搜索 阶段

![middle](D:\DESKTOP\lab3\middle.png)

搜索到数据，展示成功

![result](D:\DESKTOP\lab3\result.png)

控制台返回也可以看到相关数据

![11](D:\DESKTOP\lab3\11.png)

## 四、问题总结与体会

【问题总结】

1、无法进行图像识别，data 返回数据中无 result

分析：返回数据 data 中仅有 **error_code**、error_msg 等内容，但 res 返回状态码为 200，即接口调用未出现问题，可以知道是后端接口问题；

解决：登录百度云平台，查找**监控报表**部分，得知返回错误状态码 **18** 对应 **API调用超出QPS限制**，领取首月免费资源后重新创建应用，配置 **API Key**和**Secret Key** 后成功展示。

【实验体会】

通过逐步学习微信云开发，了解了基本的云开发流程，以及相关**云数据库**、**云函数**、前端文件的功能与使用；

进一步熟悉了小程序开发的基本流程，同时对于前端的功能及展示代码的解读能力有了一定的提高。