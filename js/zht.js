(function(w){
	//创建一个zht的空对象，且没有原型链
	w.zht = Object.create(null);
	

	
	
	
	
	/*
	 * 移动端无缝滑屏（已做防抖动）
	 * 参数一：图片数组
	 * 参数二：是否无缝
	 * 参数三：是否有小圆点
	 * 参数四：是否开启轮播
	 * 需要在html中定义一个className 为 .carousel-wrapper 的div
	 */
	w.zht.carousel = function(imgsArr,openSeamless,openPoint,openCarousel){
		//轮播
		//获取图片
		var imgsFlag = imgsArr.length;
		if(openSeamless){
			imgsArr = imgsArr.concat(imgsArr);
		}
		//生成结构
		var carouselWrap = document.querySelector('.carousel-wrapper');
		//添加ul节点
		var carouselUl = document.createElement('ul');
		//开启3D加速
		zht.transform3d(carouselUl, 'translateZ', 1);
		//添加li节点
		var ulText = '';
		for(var i=0; i<imgsArr.length; i++){
			ulText += '<li><a href="javascript:;"><img src="'+imgsArr[i]+'"/></a></li>'
		}
		carouselUl.innerHTML = ulText;
		carouselWrap.appendChild(carouselUl);
		//设置css样式
		var styleNode = document.createElement('style');
		var styleText = '';
		styleText += '.carousel-wrapper{position: relative;width: 100%; overflow: hidden;}';
		styleText += '.carousel-wrapper>ul{width: '+imgsArr.length+'00%; list-style: none; overflow: hidden;}';
		styleText += '.carousel-wrapper>ul>li{float: left; width: '+1/imgsArr.length*100+'%;}';
		styleText += '.carousel-wrapper>ul>li img{display: block;width: 100%}';
		//小圆点默认样式
		styleText += '.active{background: white;}';
		styleText += '.carousel-wrapper div{position: absolute; bottom: 0; width: 100%; text-align: center;}';
		styleText += '.carousel-wrapper div span{display: inline-block; margin-left: 5px; border: 1px white solid; border-radius: 5px; width: 10px; height: 10px;}';
		
		styleNode.innerHTML = styleText;
		document.head.appendChild(styleNode);
		
		//生成小圆点
		if(openPoint){
			var pointWrap = document.createElement('div');
			var pText = '';
			for(var i=0; i<imgsFlag; i++){
				if(i==0){
					pText += '<span class="active"></span>'
				}else{
					pText += '<span></span>'
				}
			}
			pointWrap.innerHTML = pText;
			carouselWrap.appendChild(pointWrap);
		}
		
		
		//滑动
		var startX = 0;	//手指的位置
		var startY = 0;	//手指的位置
		var elementX = 0;	//元素的位置
		var now = 0;	//ul的位置
		var xOry = null;
		var lastTime = 0;
		var lastLength = 0;
		var moveTime = 1;
		var moveLength = 0;
		var carouselUl = document.querySelector('.carousel-wrapper>ul');
		//触屏事件
		carouselWrap.addEventListener('touchstart', function(ev){
			ev = ev||event;
			var touchC = ev.changedTouches[0];
			
			//重置移动方向
			xOry = 'first';
			
			
			//无缝
			if(openSeamless){
				now = zht.transform3d(carouselUl, 'translateX')/document.documentElement.clientWidth;
				if(now == 0){
					now = -imgsFlag;
				}else if(now == 1-imgsArr.length){
					now = 1-imgsFlag
				}
				zht.transform3d(carouselUl, 'translateX', now*document.documentElement.clientWidth)
			}
			
			startX = touchC.clientX;	//更新手指位置
			startY = touchC.clientY;	//更新手指位置
			elementX = zht.transform3d(carouselUl, 'translateX');	//更新元素位置
			carouselUl.style.transition = 'none';	//清除过度
			
			//初始化速度参数
			lastTime = new Date().getTime();
			lastLength = 0;
			moveLength = 0;
			
			//禁止轮播
			if(openCarousel){
				clearInterval(timer);
			}

		})
		
		//触屏移动
		carouselWrap.addEventListener('touchmove', function(ev){
			ev = ev||event;
			var touchC = ev.changedTouches[0];
			var nowX = touchC.clientX;	//当前手指位置
			var nowY = touchC.clientY;	//当前手指位置
			var touchX = nowX - startX;	//手指移动的位置
			var touchY = nowY - startY;	//手指移动的位置
			//同步滑动方向(放抖动)
			if(xOry == 'first'){
				xOry = Math.abs(touchX) > Math.abs(touchY) ? 'x' : 'y';
			}
			//放抖动
			if(xOry == 'y'){
				return;
			}
			
			//同步速度参数
			var nowTime = new Date().getTime();
			var nowLength = touchC.clientX;
			moveTime = nowTime - lastTime;
			moveLength = nowLength - lastLength;
			lastTime = nowTime;
			lastLength = nowLength;
			
			//实时同步滑屏
			zht.transform3d(carouselUl, 'translateX', elementX + touchX)
		})
		
		//触屏离开
		carouselWrap.addEventListener('touchend', function(ev){
			ev = ev||event;
			var touchC = ev.changedTouches[0];
			
			//计算手指滑动的速度
			var speed = moveLength / moveTime;
			if(Math.abs(speed) < 0.5){
				//1/2滑屏
				now = Math.round(zht.transform3d(carouselUl, 'translateX') / document.documentElement.clientWidth);
			}else{
				speed>0?now++:now--;
			}
			
			//判断边界
			if(now >= 0){
				now = 0;
			}else if(now < 1-imgsArr.length){
				now = 1-imgsArr.length;
			}
			zht.transform3d(carouselUl, 'translateX', now * document.documentElement.clientWidth)
			carouselUl.style.transition = '0.5s';	//给移动添加过度
			//同步小圆点
			if(openPoint){
				point();
			}
			//开启自动轮播
			if(openCarousel){
				carousel();	
			}
		})
		
		//同步小圆点函数
		function point(){
			var points = document.querySelectorAll('.carousel-wrapper div span')
			for(var i=0; i<imgsFlag; i++){
				points[i].className = ''
			}
			points[-now%imgsFlag].className = 'active';
		}
		
		if(openCarousel){
			var timer = null;	//自动轮播定时器	
			carousel();
		}
		
		//自动轮播函数
		function carousel(){
			clearInterval(timer);
			timer = setInterval(function(){
				//进行轮播无缝
				if(now == 1-imgsArr.length){
					carouselUl.style.transition = 'none';
					if(openSeamless){
						now = 1-imgsFlag;
					}else{
						now = 0;
						zht.transform3d(carouselUl, 'translateX', now*document.documentElement.clientWidth);
						point();
						return;
					}
					zht.transform3d(carouselUl, 'translateX', now*document.documentElement.clientWidth);
				}
				setTimeout(function(){
					now--;
					carouselUl.style.transition = '0.5s'
					
					zht.transform3d(carouselUl, 'translateX', now*document.documentElement.clientWidth)
					point();
				}, 50);
				
			}, 3000);
		}
	}
	
	
	
	/*
	 *设置 & 读取 transform 的值
	 * 参数一：元素节点
	 * 参数二：属性名
	 * 参数三：属性值
	 * 如果传入二个参数：读取值
	 * 如果传入三个参数：设置值
	 * 注意：在使用时要给变换的元素开启3D加速
	 * 开启方法:zht.transform3d(navUl, 'translateZ', 1);
	 * */
	//设置 & 读取transform
	w.zht.transform3d = function(node, type, val){
		//判断是否存在node.transformsd对象
		if(typeof node['transforms'] === 'undefined'){
			node['transforms'] = {};
		}
		//判断参数，3个为设置，2个为读取
		if(arguments.length >= 3){
			//参数为3个，赋值操作
			var text = '';	//存放带单位的transform值
			node['transforms'][type] = val;	//把值赋给node.transformsd对象
			
			for(item in node['transforms']){
				if(node['transforms'].hasOwnProperty(item)){
					//给val添加单位
					switch (item){
						case 'translateX':
						case 'translateY':
						case 'translateZ':
							text += item + '(' + node['transforms'][item] + 'px)'
							break;
						case 'scale':
							text += item + '(' + node['transforms'][item] + ')'
							break;
						case 'rotate':
							text += item + '(' + node['transforms'][item] + ' + deg)'
							break;
					}
				}
			}
			//给节点设置transform
			node.style.transform = node.style.webkitTransform = text;
		}else if(arguments.length == 2){
			//参数为2个，读取操作
			val = node['transforms'][type];
			//设置默认值
			if(typeof val === 'undefined'){
				if(type === 'translateX' || type === 'translateZ' || type === 'translateY' || type === 'rotate'){
					val = 0;
				}else if(type === 'scale'){
					val = 1;
				}
			}
			return val;	//返回transform值
		}
	}
	
	
	
	/*
	 * 给元素添加class
	 * 参数一：元素节点
	 * 参数二：class
	 * */
	w.zht.addClass = function (node,className){
		var reg=new RegExp("\\b"+className+"\\b");
		if(!reg.test(node.className)){
			node.className +=(" "+className); 
		}
	}
	
	
	/*
	 * 给元素删除class
	 * 参数一：元素节点
	 * 参数二：class
	 */
	w.zht.removeClass = function (node,className){
		if(node.className){
			var reg=new RegExp("\\b"+className+"\\b");
			var classes = node.className;
			node.className=classes.replace(reg,"");
			if(/^\s*$/g.test(node.className)){
				node.removeAttribute("class");
			}
		}else{
			node.removeAttribute("class");
		}
	}
	
	
	
	/*
	 * 获取CSS属性值
	 * 参数一：元素节点
	 * 参数二：css属性名
	 */
	w.zht.getStyle = function(node,attr){
		if(node.currentStyle){    //IE
			return node.currentStyle[attr];
		}
		else{  //FireFox
			return getComputedStyle(node,false)[attr];
			//false是一个虚元素，或者是一个伪类‘abc’,123均可
		}
	}
	
	
	
	/*
	 * 移动端竖向滑屏效果
	 * 参数一：外层包裹区
	 * 参数二：回调函数（可以没有）
	 * 注意：
	 * 外层函数内需要嵌套
	 */
	w.zht.moveScreen = function(wrapNode,callBack){
   		var innerNode = wrapNode.children[0];
		//开启3d加速
		zht.transform3d(innerNode, 'translateZ', 1);
		
		//放抖动
		var xOry = 'first';
		var isMove = false;	//判断是否滑动导航条
		var startY = 0;	//手指点击位置
		var elementY = 0;	//元素位置
		var lastTime = 0;	//上一次touchmove的时间
		var lastLength = 0;	//上一次touchmove的长度
		var moveTime = 1;	//移动的时间
		var moveLength = 0;	//移动的长度
		var speed = 0;	//速度
		var minPositionY = wrapNode.offsetHeight - innerNode.offsetHeight;
		//定义Tween算法
		var Tween={
			easeOut: function(t,b,c,d){
			    return -c *(t/=d)*(t-2) + b;
			},
			 Back: function(t,b,c,d,s){
	            if (s == undefined) s = 1.70158;
	            return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
	        }
		}
		wrapNode.addEventListener('touchstart', function(ev){
			ev = ev||event;
			var touchC = ev.changedTouches[0];
			//同步最小位置
			minPositionY = wrapNode.offsetHeight - innerNode.offsetHeight;
			startX = touchC.clientX;
			startY = touchC.clientY;
			elementX = zht.transform3d(innerNode, 'translateX');
			elementY = zht.transform3d(innerNode, 'translateY');
			innerNode.style.transition = 'none';
			
			//初始化isMove
			isMove = false;
			
			//初始化lastTime，lastLength
			lastTime = new Date().getTime();
			lastLength = touchC.clientY;
			moveLength = 0;
			//清除定时器
			clearInterval(wrapNode.timer);
			//重置防抖动
			xOry = 'first';
			//callBack回调函数
			if(callBack && typeof callBack['start'] === 'function'){
				callBack['start'].call(this);
			}
		})
		wrapNode.addEventListener('touchmove', function(ev){
			ev = ev||event;
			var touchC = ev.changedTouches[0];
			var touchX = touchC.clientX;
			var touchY = touchC.clientY;
			var offsetX = touchX-startX
			var offsetY = touchY-startY
			var positionX = elementX + offsetX;
			var positionY = elementY + offsetY;
			
			
			if(xOry === 'first' && Math.abs(offsetX) > Math.abs(offsetY)){
				xOry = 'x';
			}else if(xOry === 'first' && Math.abs(offsetX) < Math.abs(offsetY)){
				xOry = 'y';
			}
			if(xOry === 'x'){
				return;
			}else if(xOry === 'y'){
				//同步上一次touchmove的时间和长度
				var nowTime = new Date().getTime();
				var nowLength = touchC.clientY;
				moveTime = nowTime - lastTime;
				moveLength = nowLength - lastLength;
				lastTime = nowTime;
				lastLength = nowLength;
				
				//手指移动了
				isMove = true;
				
				//橡皮筋效果
				if(zht.transform3d(innerNode, 'translateY')>0){
					innerNode.isRubber = true;
					moveLength =  moveLength*0.3*(wrapNode.offsetHeight/(positionY+wrapNode.offsetHeight))
				}else if(zht.transform3d(innerNode, 'translateY') < minPositionY){
					innerNode.isRubber = true;
					moveLength =  moveLength*0.5*(wrapNode.offsetHeight/(-positionY+wrapNode.offsetHeight))
				}
				positionY = zht.transform3d(innerNode, 'translateY') + moveLength;
				zht.transform3d(innerNode, 'translateY', positionY);
				if(callBack && typeof callBack['move'] === 'function'){
					callBack['move'].call(this);
				}
			}
						
		})
		wrapNode.addEventListener('touchend', function(ev){
			ev = ev||event;
			var touchC = ev.changedTouches[0];
			
			//判断是否点击
			var time = 0;//过渡时间
			var type = '';
			//计数移动速度
			speed = moveLength / moveTime;
			speed = Math.abs(speed)<1?0:speed;
			elementY = zht.transform3d(innerNode, 'translateY');
			var targetY = elementY + speed*80;
			var time = Math.abs(speed)*0.20;
			time = time>1?1:time;
			//判断边界值
			if(targetY>0){
				targetY = 0;
				type = "Back";
			}else if(targetY < minPositionY){
				targetY = minPositionY;
				type = "Back";
			}else{
				type="easeOut";
			}
			//分别给手动橡皮筋和自动橡皮筋效果添加 transition
			if(innerNode.isRubber){
				time = 0.5;
				type="easeOut";
				innerNode.isRubber = false
			}else{
				
			}
			move(type,targetY,time);
		})
		function move(type,targetY,time){
			//t,b,c,d,s
			var point = 0;
			var t = 0;
			var b = zht.transform3d(innerNode, 'translateY');
			var c = targetY - b;
			var d = time / (1000/60/1000);
			var s = 2;
			clearInterval(wrapNode.timer);
			wrapNode.timer = setInterval(function(){
				t++;
				if(t>d){
					clearInterval(wrapNode.timer);
					if(callBack && typeof callBack['end'] === 'function'){
						callBack['end'].call(this);
					}
					return;
				}
				point = Tween[type](t,b,c,d,s);
				zht.transform3d(innerNode, 'translateY', point);
				if(callBack && typeof callBack['move'] === 'function'){
					callBack['move'].call(this);
				}
			},1000/60);
			
			
		}
		
   	}
   




	
})(window)
