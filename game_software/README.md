# 2024年夏季《移动软件开发》实验报告



<center>姓名：李佳潼  学号：22020007043</center>

| 姓名和学号？         | 李佳潼，22020007043                                          |
| -------------------- | ------------------------------------------------------------ |
| 本实验属于哪门课程？ | 中国海洋大学24夏《移动软件开发》                             |
| 实验名称？           | 实验6：推箱子游戏                                            |
| 博客地址？           | [实验6：推箱子游戏](https://blog.csdn.net/m0_73768807/article/details/141874500) |
| Github仓库地址？     | [实验6：推箱子游戏](https://github.com/Physical2/mobile_software_1/tree/master/game_software) |



## **一、实验目标**

1、综合所学知识创建完整的推箱子游戏； 

2、能够在开发过程中熟练掌握真机预览、调试等操作。



## 二、实验步骤

**页面配置**

新建项目boxGame，创建index首页页面和game游戏页面，删除和修改文件。然后创建images文件夹用于存放图 片素材，utils文件夹用于存放data.js公共文件，完成文件配置。最后得到的目录结构：

![1](D:\DESKTOP\1.png)

**页面设计**

- 导航栏设计：修改window属性，代码如下

```json
"window": {
    "navigationBarTextStyle": "black",
    "navigationBarTitleText": "推箱子游戏",
    "navigationBarBackgroundColor": "#E64340"
  },
```

- 公共样式设计：在app.wxss中设置页面容器和顶端标题的公共样式，代码如下

```css
.container{
	height: 100vh;
	color: #E64340;
	font-weight: bold;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: space-evenly;
}
.title{
	font-size: 18pt;
}

```

- 首页设计：首页包含标题和关卡列表两部分，使用view组件实现，再为关卡对应的view组件添加wx:for属性循环显示关卡 列表数据和图片，index.wxml代码如下

```html
<view class="container">
<!-- 标题 -->
<view class="title">游戏选关</view>
<!-- 关卡列表 -->
	<view class="levelBox">
		<view class="box" wx:for="{{levels}}" wx:key="levels{{index}}" bind:tap="chooseLevel" data-level="{{index}}">
			<image src="/images/{{item}}"></image>
			<text>第{{index+1}}关</text>
		</view>
	</view>
</view>

```

- 游戏页设计：首先添加编译模式，预览game页面，使用view组件实现整体容器和标题；canvas组件实现游戏画布； button组件实现方向键和重新开始按钮，game.wxml代码如下

```html
<view class="container">
<!-- 提示 -->
	<view class="title">第{{level}}关</view>
<!-- 游戏画布 -->
	<canvas canvas-id="myCanvas"></canvas>
<!-- 方向键 -->
	<view class="btnBox">
		<button type="warn" bind:tap="up">↑</button>
		<view>
			<button type="warn" bind:tap="left">←</button>
            <button type="warn" bind:tap="down">↓</button>
			<button type="warn" bind:tap="right">→</button>
		</view>
	</view>
<!-- 重新开始 -->
	<button type="warn" bind:tap="restartGame">重新开始</button>
</view>

```



**逻辑实现**

- 公共逻辑：在data.js文件中配置游戏地图数据，以二维数组形式存放，之后使用module.exports语句暴露数据出口，再在 game.js文件顶端引用公共JS文件，代码如下

```javascript
var data = require('../../utils/data')
```

- 点击跳转游戏页面：为首页的关卡项目添加点击事件函数chooseLevel，并使用data-level属性携带关卡图片下标信息，然 后在游戏页面进行接收，显示是第几关，相应JS代码如下

```javascript
//游戏选关
chooseLevel:function(e){
	let level = e.currentTarget.dataset.level
	wx.navigateTo({
		url: '../game/game?level='+level
	})
},
/**
* 生命周期函数--监听页面加载
*/
onLoad(options) {
	let level = options.level
	//console.log('Level:',level);
	this.setData({
		level:parseInt(level) + 1
	})
	this.ctx = wx.createCanvasContext('myCanvas')
	this.initMap(level)
	this.drawCanvas()
},
```

- 绘制地图：在game.js文件顶端记录游戏初始数据信息，添加initMap函数用于初始化游戏地图数据，添加drawCanvas函数 用于将地图信息绘制到画布上，然后在onload函数中创建画布上下文和调用函数。相应函数代码如下

````javascript
//初始化地图数据
initMap:function(level){
	if (level < 0 || level >= data.maps.length) {
		console.error('Invalid level:', level);
		return;
	}
	let mapData = data.maps[level]
	for (var i = 0; i < 8; i++){
		for (var j = 0; j < 8; j++){
			box[i][j] = 0
			map[i][j] =mapData[i][j]
			if(mapData[i][j] == 4){
				box[i][j] = 4
				map[i][j] =2
			}else if(mapData[i][j] == 5){
				map[i][j] = 2
				row = i
				col = j
			}
		}
	}
},
//绘制地图
drawCanvas:function(){
	let ctx = this.ctx
	ctx.clearRect(0,0,320,320)
	for(var i=0;i<8;i++){
		for(var j=0;j<8;j++){
			let img = 'ice'
			if (map[i][j] == 1){
				img = 'stone'
			}else if (map[i][j] == 3){
				img = 'pig'
			}
//绘制地图
			ctx.drawImage('/images/icons/' + img + '.png', j*w,i*w,w,w)
			if(box[i][j] == 4){
//叠加绘制箱子
				ctx.drawImage('/images/icons/box.png', j*w,i*w,w,w)
			}
		}
	}
//叠加绘制小鸟
	ctx.drawImage('/images/icons/bird.png', col*w,row*w,w,w)
	ctx.draw()
},
````

- 方向键逻辑实现：为方向键的button按钮绑定点击事件，然后添加自定义函数up、down、left和right，实现小鸟移动。up函数 代码如下（其他3个与之类似）

```javascript
//上
up:function(){
//不在最顶端才能上移
	if(row > 0){
//不是墙也不是箱子
		if (map[row-1][col] != 1 && box[row-1][col] != 4) {
			row = row -1 //更新坐标
		}
//上方是箱子
		else if (box[row-1][col] == 4) {
//箱子不在最顶端
			if (row - 1 > 0) {
//箱子上方不是墙也不是箱子，能推动
				if (map[row-2][col] != 1 && box[row-2][col] != 4) {
					box[row-2][col] =4
					box[row-1][col] =0
					row = row - 1 //更新坐标
				}
			}
		}
		this.drawCanvas()
		this.checkWin()
	}
},

```

- 判断游戏成功：只要有一个箱子不在终点则未成功，添加函数isWin来判断；若游戏成功，则弹出提示对话框，使用checkWin 函数实现；最后在game.js的4个方向键中加入关于游戏成功的判断函数调用。具体代码如下

```javascript
//判断成功
isWin:function(){
	for (var i=0;i<8;i++){
		for(var j=0;j<8;j++){
			if (box[i][j] == 4 && map[i][j] != 3) {
				return false
			}
		}
	}
	return true
},
//弹出提示框
checkWin:function(){
	if (this.isWin()) {
		wx.showModal({
			title: '恭喜',
			content: '游戏成功！',
			showCancel:false
		})
	}
},
```

- 重新开始游戏：给相应button增加点击事件restartGame函数，函数代码如下

```javascript
//重新开始
restartGame:function(){
	this.initMap(this.data.level-1)
	this.drawCanvas()
},
```



## 三、程序运行结果

1. 首页

   ![a](D:\DESKTOP\a.png)

2.  点击进入相应关卡的游戏页

   ![aa](D:\DESKTOP\aa.png)

3. 移动小鸟

   ![aaa](D:\DESKTOP\aaa.png)

4. 重新开始

   ![aa](D:\DESKTOP\aa.png)

5. 过关

   ![aaaa](D:\DESKTOP\aaaa.png)



## 四、问题总结与体会

【问题】

跳转后仍显示"第NULL关"，

【分析与解决】

现象说明，level未被正确传递或未被正确接收和展示

- 在index.js对应 wx.navigateTo 前添加以下打印代码，检查传参level，结果正确

```javascript
console.log("level",level)
```

- 在game.js onLoad 中添加以下打印代码，检查传参

```javascript
console.log(options.level)
```

结果为 url: '../game/game?level=' + level, 代码句中，“=”号后多了一个空格

【体会】

本项目注重对逻辑功能的实现，更需要认真，注重细节，也进一步熟悉了通过控制台打印 console.log("注释", 返回数据) ，自主查看文件报错的原因所在，进一步提高了前后端开发的能力