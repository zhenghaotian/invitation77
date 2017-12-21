(function(){
	var style = document.createElement('style');
	var width = document.documentElement.clientWidth/16;
	style.innerHTML = 'html{font-size: '+width+'px!important}';
	document.head.appendChild(style);
})()

document.addEventListener('touchstart', function(ev){
	ev = ev || event;
	ev.preventDefault();
})

window.onload = function(){
	var i=1;
	
	//第二屏
	var span1 = document.querySelector('#span1');
	var div1 = document.querySelector('.div2-3');
	var msg1 = '欧阳应霁曾说: 不在于食材的珍稀 烹调的复杂 也不在于装潢的奢华 只有跟对的人在一起 彼此相伴、分享美味 才最是珍贵'

	div1.addEventListener('animationend', function(){
		i = 1
		printWord(span1,msg1,i)
	});
	
	//第三屏
	var span2 = document.querySelector('#span2');
	var msg3 = '对的人，固然重要但我们认为美味是幸福最好的奖赏';
	var li3 = document.getElementsByClassName('div3-7');
	li3[0].addEventListener('animationend', function(){
		i = 1;
		printWord(span2,msg3,i)
	});
	
	
	//逐字打印
	function printWord(node,msg,i){
		var t;
		t = setInterval(function(){
			var len=msg.length;
		    var msg1=msg.substring(0,i);
		    node.innerHTML=msg1;  
		    if(i>=len){
					clearInterval(t);
					return
		    }
		    else  
		        i++;  
		},200)
	}
	
	
	
	
	move();
	//屏幕切换
	function move(){
		//获取滑动元素
		var ul = document.querySelector('#wrap>ul')

		//判断是否在滑动
		var isMove = false
		
		//定义变量
		var startY = 0;
		var moveY = 0;
		var endY = 0;
		//当前页面
		var index = 1;
		var lastIndex = 1;



		
		
		ul.addEventListener('touchstart', function(ev){
			ev = ev || event;
			var touchC = ev.changedTouches[0];
			
			//清空
			startY = 0;
			moveY = 0;
			endY = 0;
			startY = touchC.clientY;
		})
		ul.addEventListener('touchmove', function(ev){
			ev = ev || event;
			var touchC = ev.changedTouches[0];
			moveY = touchC.clientY - startY;
		})
		ul.addEventListener('touchend', function(ev){
			ev = ev || event;
			endY = moveY;	//手指向上为负值

			if(!isMove){
				isMove = true
				if(endY < -50){
					//手指向上,页面向下
					if(index==7){
						lastIndex = index;
						return;
					}
					index++;
					var lastPage = '.li-'+lastIndex;
					var nowPage = '.li-'+index;
					var last = document.querySelector(lastPage);
					var now = document.querySelector(nowPage);

					//添加出入场动画
					zht.addClass(last,'outAnT');
					zht.addClass(now,'inAnB');
					zht.removeClass(now,'hidden');

					setTimeout(function(){
						zht.removeClass(last,'outAnT');
						zht.removeClass(now,'inAnB');
						zht.addClass(last,'hidden');

						//清除逐字文本内容
						var span2 = document.querySelector('#span2');
						var span1 = document.querySelector('#span1');
						span1.innerHTML = ''
						span2.innerHTML = ''
						i = 100

						//允许滑动
						isMove = false

					}, 1000)

				}else if(endY > 50){
					//手指向下,页面向上
					if(index==1){
						lastIndex = index;
						return;
					}
					index--;
					var lastPage = '.li-'+lastIndex;
					var nowPage = '.li-'+index;
					var last = document.querySelector(lastPage);
					var now = document.querySelector(nowPage);

					//添加出入场动画
					zht.addClass(last,'outAnB');
					zht.addClass(now,'inAnT');
					zht.removeClass(now,'hidden');

					//清除逐字文本内容
					var span2 = document.querySelector('#span2');
					var span1 = document.querySelector('#span1');

					setTimeout(function(){
						zht.removeClass(last,'outAnB');
						zht.removeClass(now,'inAnT');
						zht.addClass(last,'hidden');

						//清除逐字文本内容
						var span2 = document.querySelector('#span2');
						var span1 = document.querySelector('#span1');
						span1.innerHTML = ''
						span2.innerHTML = ''
						i = 100


						//允许滑动
						isMove = false

					}, 1000)
				}else{
					return;
				}
				lastIndex = index;
			}
			
		})
	}
	
	
	
}

