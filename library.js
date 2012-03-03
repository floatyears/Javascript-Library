/*
 * DOM Manipulation Functions
 *
 */

/*
 * $():
 * 获取一个或者一组DOM节点，可传入参数为id或者DOM节点，支持多个参数的传递。
 */
function $(){
	var elems = [];
	for(var i = 0; i < arguments.length; i++){
		var elem = arguments[i];
		if(typeof elem == "string"){
			elem = document.getElementsById(elem);
		}
		
		if(arguments.length == 1){
			return elem;
		}else{
			elems.push(elem);
		}
	}
	return elems;
}

/*
 * getByClassName():通过类名来获取元素
 * className表示类名
 * elem表示要要取得的元素的上下文。默认为document
 */
function getByClassName(className,elem){
	elem = elem || document;
	if(elem.getElementsByClassName){
		return elem.getElementsByClassName(className);
	}else{
		var elems = elem.getElementsByTagName("*"),nodes = [];
		for(var i = 0; i < elems.length; i++){
			if(hasClass(elems[i],className)){
				nodes.push(elems[i]);
			}	
		}
		return nodes;
	}
}

/*
 * getChildren():获取节点类的子元素
 * elem：要获取子元素的节点。
 */
function getChildren(elem){
	var elems = [];
	for(var i = 0,children = elem.childNodes, len = children.length; i < len; i ++){
		if (children[i].nodeType == 1){
			elems.push(children[i]);
		}
	}
	return elems;
}

/*
 * Cascading Stylsheet Manipulation Funcitons
 *
 *
 */

/*
 * 
 *
 */
 
/*
 * camlize():将值变为驼峰式
 * 例如:'word-word'转化为'wordWord'
 */
function camlize(prop){
	return prop.replace(/\-(\w)/g,function(strMatch,p1){
		return p1.toUpperCase();
	});
}

/*
 * uncamlize():将值变为间隔式
 * sep：间隔符，如果没有定义，则使用默认的'-'
 * 例如:'wordWord'转化为'word-word'
 */
function uncamlize(prop,sep){
	return prop.replace(/[A-Z]/g,function(strMatch){
		return ((sep?sep:"-") + strMatch.toLowerCase());
	})
}

/*
 * getStyle():获得元素的最终样式
 * elem表示操作的元素
 * props表示要获取的属性。例如：['background-color','height']
 * pseudoEl表示伪元素，例如getStyle(elem,['height'],':before')
 */
function getStyle(elem,props,pseudoEl){
	var styles = {},defaultView;
	if(!(elem = $(elem)) && !props) return false;
	//if(typeof(props).toLowerCase() == 'array' )
	if(elem.currentStyle){
		for(var i = 0; i < props.length; i++){
			/*
			if(!(styles[props[i]] = elem.style[camlize(props[i])])){
				if(!(styles[props[i]] = elem.currentStyle[props[i]])) continue;
			}*/
			if(!(styles[props[i]] = elem.currentStyle[props[i]])) continue;
		}
	}
	if(defaultView = window.getComputedStyle || document.defaultView.getComputedStyle){
		for(var i = 0; i < props.length; i++){
			/*
			if(!(styles[props[i]] = elem.style[camlize(props[i])])){
				if(!(styles[props[i]] = window.getComputedStyle(elem,pseudoEl).getPropertyValue(props[i]))) continue;
			}
			*/
			if(!(styles[props[i]] = defaultView(elem,pseudoEl).getPropertyValue(props[i]))) continue;
		}
		
	}
	return styles;
}

/*
 * setStyleById():根据$()函数得到的元素来设置样式
 * elem表示操作的元素。
 * styles表示要设置的样式值。例如：setStyle(elem,{'background-color':'black'})
 */
function setStyleById(elem,styles){
	if(!(elem = $(elem))) return false;
	for(var prop in styles){
		if(!styles.hasOwnProperty(prop)) continue;
		if(elem.style.setProperty){
			elem.style.setProperty(uncamlize(prop,'-'),styles[prop],null);
			//console.log(camlize(prop));
		}else{
			elem.style[camelize(prop)] = styles[prop];
		}
	}
}

/*
 * setStyleByClassName()；根据传入的类名设置样式
 * className表示类名
 * styles表示样式值。例如：setStyle(elem,{'background-color':'black'})
 */
function setStyleByClassName(className,styles,parent){
	if(!(parent = $(parent))) return false;
	if(!(elems = getByClassName(classNam,parent))) return false;
	for(var i = 0; i < elems.length; i++){
		setStyleById(elems[i],styles);
	}
}

/*
 * setStyleByTagName():根据标签名设置元素样式
 * tagName表示标签名。
 * styles表示要设置的样式
 * parent表示父元素。
 */
function setStyleByTagName(tagName,styles,parent){
	parent = $(parent) || document;
	var elems = parent.getElementByTagName(tagName);
	for(var i in elems){
		setStyleById(elems[i],styles);
	}
}

/*
 * getClass():获取元素的类名
 *
 */
function getClass(elem){
	if(!(elem = $(elem))) return false;
	return elem.className.split(/\s+/g);
}

/*
 * hasClass():检测某个元素是否含有相应类名
 * elem表示要检测的元素
 * className表示类名
 */
function hasClass(elem,className){
	var classNames;
	if(!(classNames = getClass(elem))) return false;
	for(var i = 0; i < classNames.length; i++){
		if(classNames[i] == className){
			return true;
		}
	}
	return false;
}

/*
 * removeClass():移除元素的类名
 *
 */
function removeClass(elem,className){
	var classNames;
	if(!(classNames = getClass(elem))) return false;
	//var classNames = getClass(elem);
	for(var i = classNames.length - 1; i >= 0; i--){
		if(classNames[i] === className){
			classNames.splice(i,1);
			console.log(classNames)
		}
	}
	//console.log(classNames);
	elem.className = classNames.join(' ');
}

/*
 * addClass():添加元素的样式
 *
 */
function addClass(elem,classNames){
	if(!(elem = $(elem))) return false;
	elem.className += (elem.className?' ':'') + classNames;
	/*
	var classes = getClass(elem);
	classes.push(classNames.split(/\s+/g));
	console.log(classes);
	elem.className = classes.join(' ');
	*/
}

/*
 * toggleClass():变换元素样式
 *
 */
function toggleClass(elem,className){
	if(!(elem = $(elem))) return false;
	if(hasClass(elem,className)){
		removeClass(elem,className);
	}else{
		addClass(elem,className);
	}
}

/*
 * setActiveStyleSheet():切换备用样式表
 *
 */
function setActiveStyleSheet(url,title){
	var links = document.getElementsByTagName('link'),a;
	for(var i = 0; (s = links[i]); i++){
		if(s.rel.indexOf('style') != -1){
			s.disabled = true;
			if(s.getAttribute('title') && s.getAttribute('title') == title) s.disabled = false;
		}
	}
}

/*
 * getStyleSheet():获得样式表
 * url表示样式表的路径或文件名+路径。例如url可以为/skin/common.css，也可以是/skin/，如果是空字符串，则返回所有的样式表
 *
 */
function getStyleSheets(url,media){
	var sheets = [],s;
	for(var i = 0; (s = document.styleSheets[i]); i++){
		if(url?(s.href?(s.href.indexOf(url) == -1):true):false){
			//sheets.splice(i,1);   因为document.styleSheets不是数组，而是有item()方法的Object，所以不能使用数组的方法。
			//console.log(s?document.styleSheets[i]:1);
			continue;
		}else{
			if(media){
				//console.log(11);
				media = media.replace(/,\s*/,',');
				//console.log(media);
				var sheetMedia;
				//console.log(typeof(s.media.mediaText));
				if(typeof(s.media.mediaText)){
					//console.log(s.media.mediaText);
					sheetMedia = s.media.mediaText.replace(/,\s*/,','); // DOM的方式
					//console.log(s.media.mediaText);
					sheetMedia = sheetMedia.replace(/,\s*$/,''); // Safari的bug
				}else{
					sheetMedia = s.media.replace(/,\s*/,','); // MSIE的方式
				}
				if(media != sheetMedia){
					//sheets.splice(i,1);
					continue;
				}
			}
		}
		sheets.push(s);
	}
	return sheets;
}

/*
 * addStyleSheet():添加样式表
 * url表示添加的样式表的相对路径
 * title表示title属性
 * media表示媒体类型，可选参数
 */
function addStyleSheet(url,title,media){
	var link = document.creatElement('link');
	link.setAttribute('href',url);
	link.setAttribute('rel','stylesheet');
	link.setAttribute('title',title?title:'');
	link.setAttribute('media',media);
	link.setAttribute('type','text/css');
	document.getElementsByTagName('head')[0].appendChild(link);
}
/*
 * removeStyleSheet():移除样式表
 * url表示将要移除的样式表的相对路径
 * media表示媒体类型，可选参数
 */
function removeStyleSheet(url,media){
	var links = document.getElementsByTagName('link');
	//console.log(links);
	for(var i = 0; (s = links[i]); i++){
		if(s.getAttribute('href').indexOf(url) != -1 && (media?(s.getAttribute('media') == media):true)){
			s.parentNode.removeChild(s);
		}
	}
}

/*
 * editeCSSRule():编辑样式规则
 *
 */
function editCSSRule(selector,styles,url,media){
	var sheets = getStyleSheets(url,media);
	for(var i = 0; i < sheets.length; i++){
		var cssRules = sheets[i].cssRules || sheets[i].rules;
		if(!cssRules) continue;
		for(var j = 0; j < cssRules.length; j++){
			if(selector.toUpperCase() == cssRules[j].selector.toUpperCase()){
				for(var prop in styles){
					if(!styles.hasOwnProperty(prop)) continue;
					cssRules[j].style[camlize(prop)] = styles[prop];
					console.log('done');
				}
			}
		}
	}
}

/*
 * addCSSRule():添加CSS样式
 *
 */

function addCSSRule(selector,styles,index,url,media){
	var declaration = '';
	var sheets = getStyleSheets(url,media);
	for(var prop in styles){
		if(!styles.hasOwnProperty(prop)){
			continue;
		}else{
			declaration += prop + ':' + styles[prop] + ';';
		}
	}
	for(var i = 0; i < sheets.length; i++){
		var cssRules = sheets[i].cssRules || sheets[i].rules;
		if(sheets[i].insertRule){
			var newIndex = ((parseInt(index) >=0) ? index : cssRules.length);
			sheets[i].insertRule(selector + '{' + declaration + '}',newIndex);
			console.log(1);
		}else if(sheets[i].addRule){
			var newIndex = index >= 0 ? index : cssRules.length;
			sheets[i].addRule(selector,declaration,newIndex);
			console.log(2);
		}
	}
}
 
/*
 * addEvent():给元素添加事件监听
 * elem表示要监听的元素
 * type表示事件类型。例如:'mouseover'
 * func表示事件监听函数。
 */
function addEvent(elem,type,func){
	if(elem.attachEvent){
		elem['e'+type+func] = func;
		//elem[type+func] = function(){elem['e'+type+func](window.event);}
		elem.attachEvent('on'+type,function(){elem['e'+type+func](window.event);});
	}else if(elem.addEventListener){
		elem.addEventListener(type,func,false);
	}else{
		alert('Handler can not be attached!');
	}
	//return elem.attachEvent?elem.attachEvent('on'+type,func):elem.addEventListener(type,func);
}

/*
 * deleteEvent()：删掉元素上的事件
 *
 *
 */
function deleteEvent(elem,type,func){
	if(elem.detachEvent){
		//elem['d'+type+func] = func;
		elem.detachEvent('on'+type,func);
	}else if(elem.removeEventListener){
		elem.removeEventListener(type,func);
	}
}

/*
 * addLoadEvent:增加DOMContentLoad事件。
 */
function addLoadEvent(LoadEvent,waitForImages){
	if(waitForImages){
		addEvent(window,'load',LoadEvent);
	}
	var init = function(){
		if(arguments.callee.done){
			return;
		}
		arguments.callee.done = true;
		LoadEvent.apply(document,arguments);
	}
	if(document.addEventListner){
		addEvent(document,'DOMContentLoaded',LoadEvent);
		return;
	}
	if(/WebKit/i.test(navigator.userAgent)){
		var _loadId = setInterval(function(){
			if(/load|complete/i.test(document.readyState)){
				init();
				clearInterval(_loadId);
			}
		},100)
	}
	if(checkIE()){
		var script = document.createElement('script');
		script.src = 'javascript:void(0)';
		document.getElementsByTagName('body')[0].appendChild(script);
		if(script.onreadStatechange){
			script.onreadystatechange = function(){
				if(this.readyState == 'complete'){
					init();
					console.log('IE');
				}
			}
		}
	}
}

/*
 * checkIE():检查IE浏览器版本
 */
function checkIE(){
	var undef, version = 3, div = document.createElement('div'), all = div.getElementsByTagName('i');
	while(div.innerHTML = '<!--[if gt IE' + (++version) + ']><i></i><![endif]-->',all[0]);
	return version > 4 ? version:undef;
}

/*
 * getTarget():获取event对象及target属性。
 * 
 */
function getEvent(e){
	var event = e || window.event;
	event.target = event.target || event.srcElement;
	if(event.target.nodeType == document.TEXT_NODE){ //解决Safari的bug
		event.target = event.target.parentNode;
	}
	return event;
}

/*
 *getMouseButton():获取单击的鼠标按键
 *
 *
 */
function getMouseButton(e){
	var e = getEvent(e);
	var button = {
		'left' : false,
		'middle' : false,
		'right' : false
	}
	if(e.toString && e.toString().indexOf('MouseEvent') != -1){
		switch(e.button){
			case 0:
				button['left'] = true;break;
			case 1:
				button['middle'] = true;break;
			case 2:
				button['right'] = true;break;
			defualt:
				break;
		}
	}else if(e.button){
		switch(e.button){
			case 1: button['left'] = true;break;
			case 2: button['right'] = true;break;
			case 3: button['left'] = true;button['right'] = true;break;
			case 4: button['middle'] = true;break;
			case 5: button['left'] = true;button['middle'] = true;break;
			case 6: button['middle'] = true;button['right'] = true;break;
			case 7: button['left'] = true;button['middle'] = true;button['right'] = true;break;
		}
	}
	else{
		return false;
	}
	return button;
}

/*
 * getMousePosition():获取鼠标的位置。
 *
 *
 */
function getMousePosition(e){
	var e = getEvent(e);
	var x = e.pageX || (e.clientX + (document.documentElement.scrollLeft || document.body.scrollLeft));
	var y = e.pageY || (e.clientY + (document.documentElement.scrollTop || document.body.scrollTop));
	return {'x':x,'y':y}
}

/*
 * getKeyPressed():获取按键的键值
 *
 *
 */
function getKeyPressed(e){
	e = getEvent(e);
}
 
 

/*
 * animate():
 * elem: the element to animate.
 * from: object,the element's starting properties,or has no value
 * to: object,the element's ending state.
 */

function animate(elem,from,to,dur,fx,func,fps,_addqueue){
	fps = fps || 25;
	var sep = parseInt(1000/fps),curTime = 0, times = parseInt(fps*dur), changes = {}, curVal = {},dur = dur*1000,origin = {};
	origin['from'] = from;
	origin['to'] = to;
	origin['dur'] = dur;
	origin['fx'] = fx;
	origin['func'] = func;
	origin['fps'] = fps;
	for(var prop in to){
		var props = [];
		props.push(prop);
		from[prop] = parseInt((from[prop]?from[prop]:getStyle(elem,props)[prop]).replace(/\D*/g,''));
		to[prop] = parseInt(to[prop].replace(/\D*/g,''));
		changes[prop] = parseInt(to[prop] - from[prop]);
 	}

	if(getStyle(elem,['display'])['display'] == 'none'){
		setStyleById(elem,{'display':'block'});
		origin['display'] = 'none';
	}
	/*
	if(Queue.checkQueue(elem)){
		console.log('the queue is not empty');
		return;
	}*/
	var animateId = setInterval(function(){
		if(curTime > dur) {
			Queue.deQueue(elem,animateId);
			//Queue.checkQueue(elem)
			//var data = Queue.originData(elem)
			//if(data['display'] == 'none' && data['to']['height'] == '0px'){
			if(getStyle(elem,['height'])['height'] == '0px'){ //这个判断，比较特殊。一般性的判断暂时还没想出来。
				setStyleById(elem,{'display':'none'});
			}
			//console.log('animate was dequeue');
		}
		
		/*
		if(Queue.checkQueue(elem)){
			clearAnimate(elem,animateId);
		}*/
		for(var prop in from){
			//from[prop1] = parseInt(from[prop1] + changes[prop1]);
			//if (from[prop1] > to[prop1]) clearTimeout(animateId);
			curVal[prop] = fx(curTime,from[prop],changes[prop],dur) + 'px';
		}
		setStyleById(elem,curVal);
		curTime += sep;
	},sep);
	Queue.addQueue(elem,animateId,origin);//console.log('');
}

/*
 * Queue:队列对象
 * checkQueue()：检查相应的元素和animateId是否在队列中。
 * addQueue()：将响应的元素和animateId值添加到队列中。
 * deQueue():将animateId弹出队列并停止动画。
 */
var Queue = (function(){
	//var queues = [];
	var queue = [];
	return {
		//queue:queue,
		checkQueue:function(elem){
			for(var e = 0; e < queue.length; e++){
				if(queue[e].element == elem) return e;
			}
			return;
		},
		originData:function(elem){
			return queue[this.checkQueue(elem)]['origin'];
		},
		addQueue:function(elem,animateId,origin){
			var e = this.checkQueue(elem);
			if(e || e == 0){
				//for(var i = 0, len = queue.length; i < len; i++){
					//var this.checkQueue(elem);
					if(queue[e].element == elem){ //每个元素在queue数组中占一个位置，相同的元素只推入animateId
						//console.log(len);
						queue[e].animateId.push(animateId); //推入当前的animateId
						//clearInterval(queue[i].animateId[queue[i].animateId.length-2]); //将前面的animateId清除
						this.deQueue(elem,queue[e].animateId[queue[e].animateId.length-2])
						return;
						//console.log(elem.childNodes.length);
					}
					//console.log(len);
				//}
				//queue.push({'element':elem,'animateId':[animateId],'origin':origin});	
			}else{
				queue.push({'element':elem,'animateId':[animateId],'origin':origin});
			}
			
			
			/*if(n > 1){
				n = 0;
				this.deQueue(animateId);
				console.log(Queue.queue);
			}else{*/

				/*console.log(Queue.queue);*/
			
			
			console.log(queue);
			//queue[animateId] = elem;
			//setTimeout(deQueue(animateId),delay?delay+dur:dur);
		},
		deQueue:function(elem,animateId,index){
			for(var i = 0; i < queue.length; i++){
				if(queue[i] && queue[i].element == elem){
					clearInterval(animateId);
					if(index || index == 0){ //如果传入Id，就简化操作
						queue[i].animateId.splice(index,1);
					}else{
						for(var j = 0, aq = queue[i].animateId; j< aq.length; j++){
							if(aq[j] == animateId){
								queue[i].animateId.splice(j,1);
							}
						}
					}
					//queue[i].animateId.shift();
					//console.log(Queue.queue);
				}
			}
			//queue[elem] = null;
		}
	}
})();


/*
 * jQuery EasIng v1.1.2 - http://gsgd.co.uk/sandbox/jquery.easIng.php
 *
 * Uses the built In easIng capabilities added In jQuery 1.1
 * to offer multiple easIng options
 *
 * Copyright (c) 2007 George Smith
 * Licensed under the MIT License:
 *   http://www.opensource.org/licenses/mit-license.php
 */

// t: current time, b: begInnIng value, c: change In value, d: duration

Easing = 
{
	easeLine: function(t, b, c, d){
		return b + t/d*c;
	},
	easeInQuad: function (t, b, c, d) {
		return c*(t/=d)*t + b;
	},
	easeOutQuad: function (t, b, c, d) {
		return -c *(t/=d)*(t-2) + b;
	},
	easeInOutQuad: function (t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t + b;
		return -c/2 * ((--t)*(t-2) - 1) + b;
	},
	easeInCubic: function (t, b, c, d) {
		return c*(t/=d)*t*t + b;
	},
	easeOutCubic: function (t, b, c, d) {
		return c*((t=t/d-1)*t*t + 1) + b;
	},
	easeInOutCubic: function (t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t + b;
		return c/2*((t-=2)*t*t + 2) + b;
	},
	easeInQuart: function (t, b, c, d) {
		return c*(t/=d)*t*t*t + b;
	},
	easeOutQuart: function (t, b, c, d) {
		return -c * ((t=t/d-1)*t*t*t - 1) + b;
	},
	easeInOutQuart: function (t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
		return -c/2 * ((t-=2)*t*t*t - 2) + b;
	},
	easeInQuint: function (t, b, c, d) {
		return c*(t/=d)*t*t*t*t + b;
	},
	easeOutQuint: function (t, b, c, d) {
		return c*((t=t/d-1)*t*t*t*t + 1) + b;
	},
	easeInOutQuint: function (t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
		return c/2*((t-=2)*t*t*t*t + 2) + b;
	},
	easeInSine: function (t, b, c, d) {
		return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
	},
	easeOutSine: function (t, b, c, d) {
		return c * Math.sin(t/d * (Math.PI/2)) + b;
	},
	easeInOutSine: function (t, b, c, d) {
		return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
	},
	easeInExpo: function (t, b, c, d) {
		return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
	},
	easeOutExpo: function (t, b, c, d) {
		return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
	},
	easeInOutExpo: function (t, b, c, d) {
		if (t==0) return b;
		if (t==d) return b+c;
		if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
		return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
	},
	easeInCirc: function (t, b, c, d) {
		return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
	},
	easeOutCirc: function (t, b, c, d) {
		return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
	},
	easeInOutCirc: function (t, b, c, d) {
		if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
		return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
	},
	easeInElastic: function (t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
	},
	easeOutElastic: function (t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
	},
	easeInOutElastic: function (t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
		return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
	},
	easeInBack: function (t, b, c, d, s) {
		if (s == undefined) s = 1.70158;
		return c*(t/=d)*t*((s+1)*t - s) + b;
	},
	easeOutBack: function (t, b, c, d, s) {
		if (s == undefined) s = 1.70158;
		return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
	},
	easeInOutBack: function (t, b, c, d, s) {
		if (s == undefined) s = 1.70158; 
		if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
		return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
	},
	easeInBounce: function (t, b, c, d) {
		return c - Easing.easeOutBounce (d-t, 0, c, d) + b;
	},
	easeOutBounce: function (t, b, c, d) {
		if ((t/=d) < (1/2.75)) {
			return c*(7.5625*t*t) + b;
		} else if (t < (2/2.75)) {
			return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
		} else if (t < (2.5/2.75)) {
			return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
		} else {
			return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
		}
	},
	easeInOutBounce: function (t, b, c, d) {
		if (t < d/2) return Easing.easeInBounce (t*2, 0, c, d) * .5 + b;
		return Easing.easeOutBounce (t*2-d, 0, c, d) * .5 + c*.5 + b;
	}
}

/*
 * getType():获取数据类型
 *
 *
 */
function getType(obj){
	var _obj = obj
	var type = typeof(_obj);
	if(type == 'object'){
		if(type == null) return 'null';
		for(var t = 0, a; a = ['array','regexp','date'][t]; t++){
			//console.log(_obj.constructor.toString().toLowerCase());
			if(_obj.constructor.toString().toLowerCase().indexOf(a) != -1) return a;
		}
		return 'object';
	}
	else{
		return type;
	}
}

/*
 * createXHR():创建一个XHR对象
 *
 */
function createXHR(){
	var request;
	if(window.XMLHttpRequest){
		return new XMLHttpRequest();
	}else if(window.ActiveXObject){
		if(typeof arguments.callee.activeXObject != 'string'){
			var versions = ['MSXML2.XMLHttp.6.0','MSXML2.XMLHttp.3.0','MSXML2.XMLHttp'];
			for(var i = 0; i < versions.length; i++){
				try{
					request = new ActiveXObject(versions[i]);
					arguments.callee.activeXString = versions[i];
					return reqeust;
				}catch(e){
				
				}
			}
		}
		return new ActiveXObject(arguments.callee.activeXString);
	}else{
		throw new Error('No XHR Object available.');
	}
}


/*
 * ajaxRequest():XHR请求函数
 * url为请求的url地址
 * options可包含的键有：options['method']，请求方法；options['send']，请求发送的内容；options['nosendListener']，未调用send方法的事件监听函数；
 * options['noloadListener']：未接收到响应的事件监听函数；options['loadingListener']，正在加载的事件监听函数；
 * options['htmlResponseListener']，options['xmlResponseListener']，options['jsResponseListener']，options['jsonResponseListener']：对应的返回对象的处理函数；
 * options['completeListener']，完成请求的监听函数；options['errorListener']，错误处理函数。
 */
function ajaxRequest(url,options){
	var request = createXHR();
	options = options || [];
	options['method'] = options['method'] || GET;
	option['send'] = options['send'] || null;
	request.onreadystatechange = function(){
		switch(request.readyState){
			case 1: // 调用了open，尚未调用send
				if(options['nosendListener']){
					options['nosendListener'].apply(request,arguments);
				}
				break;
			case 2: // 调用了send，未接受到响应
				if(options['noloadListener']){
					options['noloadListener'].apply(request,arguments);
				}
				break;
			case 3: // 接收部分数据，但未完成
				if(options['loadingListener']){
					options['loadingListener'].apply(request,arguments);
				}
				break;
			case 4: // 接收完成
				if(request.status || request.status == '200'){
					var contentType = request.getResponseHeader('Content-Type');
					var mimeType = contentType.match(/\s*([^;]+)\s*(;|$)/i)[1];
					switch(mimeType){
						case 'text/html':
							if(options['htmlResponseListener']){
								options['htmlResponseListener'].apply(request,request.responseText);
							}
							break;
						case 'text/xml':
						case 'application/xml':
						case 'application/xthml+xml':
							if(options['xmlResponseListener']){
								options['xmlResponseListener'].apply(request,request.responseXML);
							}
							break;
						case 'text/javascript':
						case 'application/javascript':
							if(options['jsResponseListener']){
								options['jsResponseListener'].apply(request,request.responseText);
							}
							break;
						case 'application/json':
							if(options['jsonResponseListener']){
								try{
									var json = JSON.parse(request.responseText)
								}
								catch(e){
									var json = false;
								}
								options['jsonResponseListener'].apply(request,json);
							}
							break;
					}
					if(options['completeListener']){
						options['completeListener'].apply(request,arguments);
					}
				}else{
					if(options['errorListener']){
						options['errorListener'].apply(request,arguments);
					}
				}
		}
	}
	request.open(options['method'],url,true);
	request.setRequestHeader('X-Ajax-Request','AjaxRequest');
	//request.send(options['send']);
	return request;
}

var jsHttpRequestCount = 0;
var JSHttpRequest = function(timeout){
	this.requestId = 'JS_HTTP_REQUEST_' + (++jsHttpRequestCount);
	this.url = null;
	this.scriptObject = null;
	this.responseJSON = null;
	this.status = 0;
	this.readyState = 0;
	this.timeout = timeout || 30000;
}
JSHttpRequest.prototype = {
	constructor : JSHttpRequest,
	onreadystatechange:function(){console.log(1)},
	setReadyState:function(newState){
		if(this.readyState < newState || newState == 0){
			this.readyState = newState;
			//类似于观察者模式。
			this.onreadystatechange();
		}
	},
	open:function(url){
		//通过修改url参数来模拟HttpHeader
		this.url = url + ((url.indexOf('?')!=-1) ? '&' : '?' ) + 'JS_HTTP_REQUEST_CALLBACK=' + this.requestId + '_CALLBACK';
		this.setReadyState(0);
	},
	send:function(){
		var requestObject = this;
		this.scriptObject = document.createElement('script');
		this.scriptObject.setAttribute('id',this.requestId);
		this.scriptObject.setAttribute('type','text/javascript');
		var timeoutWatcher = setTimeout(function(){
			window[requestObject.requestId+'_CALLBACK'] = function(){};
			requestObject.scriptObject.parentNode.removeChild(requestObject.scriptObject);
			requestObject.status = 2;
			requestObject.statusText = 'Timeout after ' + requestObject.timout + 'milliseconds.';
			requestObject.setReadyState(2);
			console.log(requestObject);
			reqeustObject.setReadyState(3);
			console.log(requestObject);
			requestObject.setReadyState(4);
		},this.timeout)
		window[this.requestId + '_CALLBACK'] = function(JSON){
			
			//载入成功时清除timeoutWatcher
			clearTimeout(timeoutWatcher);
			
			//更新就绪状态
			requestObject.setReadyState(2);
			requestObject.setReadyState(3);
			
			//将状态设置为成功
			requestObject.responseJSON = JSON;
			requestObject.status = 1;
			requestObject.statusText = 'Loaded.'
			
			//更新就绪状态
			requestObject.setReadyState(4);
		}
		
		//设置初始就绪状态
		this.setReadyState(1);
		this.scriptObject.setAttribute('src',this.url);
		var head = document.getElementsByTagName('head')[0];
		head.appendChild(this.scriptObject);
	},
}

/*
 * getJSRequestObject():获取JSRequestObject
 *
 */
function getJSRequestObject(url,options){
	options = options || {};
	options['timeout'] = options['timeout'] || 30000;
	var request = new JSHttpRequest(options['timeout']);
	request.onreadystatechange = function(){
		switch(request.readyState){
			case 1:
				if(options['noheadListener']){
					options['noheadListener'].apply(request,arguments);
				}
				break;
			case 2:
				if(options['']){
				
				}
				break;
			case 3:
				if(options['loadingListener']){
					options['loadingListener'].apply(request,arguments);
				}
				break;
			case 4:
				if(request.status == 1){
					options['completeListener'].apply(request,arguments);
				}else if(options['errorListener']){
					options['errorListener'].apply(request,arguments);
				}
				break;
		}
		request.open(url);
		return request;
	}
}
 
/*
 * Douglas Crockford:json2.js
 *
 */
//window.JSON = undefined;
var JSON;
if (!JSON) {
    JSON = {};
}

(function () {
    'use strict';

    function f(n) {
        // Format integers to have at least two digits.
        return n < 10 ? '0' + n : n;
    }

    if (typeof Date.prototype.toJSON !== 'function') {

        Date.prototype.toJSON = function (key) {

            return isFinite(this.valueOf())
                ? this.getUTCFullYear()     + '-' +
                    f(this.getUTCMonth() + 1) + '-' +
                    f(this.getUTCDate())      + 'T' +
                    f(this.getUTCHours())     + ':' +
                    f(this.getUTCMinutes())   + ':' +
                    f(this.getUTCSeconds())   + 'Z'
                : null;
        };

        String.prototype.toJSON      =
            Number.prototype.toJSON  =
            Boolean.prototype.toJSON = function (key) {
                return this.valueOf();
            };
    }

    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        gap,
        indent,
        meta = {    // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        },
        rep;


    function quote(string) {

// If the string contains no control characters, no quote characters, and no
// backslash characters, then we can safely slap some quotes around it.
// Otherwise we must also replace the offending characters with safe escape
// sequences.

        escapable.lastIndex = 0;
        return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
            var c = meta[a];
            return typeof c === 'string'
                ? c
                : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
        }) + '"' : '"' + string + '"';
    }


    function str(key, holder) {

// Produce a string from holder[key].

        var i,          // The loop counter.
            k,          // The member key.
            v,          // The member value.
            length,
            mind = gap,
            partial,
            value = holder[key];

// If the value has a toJSON method, call it to obtain a replacement value.

        if (value && typeof value === 'object' &&
                typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }

// If we were called with a replacer function, then call the replacer to
// obtain a replacement value.

        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }

// What happens next depends on the value's type.

        switch (typeof value) {
        case 'string':
            return quote(value);

        case 'number':

// JSON numbers must be finite. Encode non-finite numbers as null.

            return isFinite(value) ? String(value) : 'null';

        case 'boolean':
        case 'null':

// If the value is a boolean or null, convert it to a string. Note:
// typeof null does not produce 'null'. The case is included here in
// the remote chance that this gets fixed someday.

            return String(value);

// If the type is 'object', we might be dealing with an object or an array or
// null.

        case 'object':

// Due to a specification blunder in ECMAScript, typeof null is 'object',
// so watch out for that case.

            if (!value) {
                return 'null';
            }

// Make an array to hold the partial results of stringifying this object value.

            gap += indent;
            partial = [];

// Is the value an array?

            if (Object.prototype.toString.apply(value) === '[object Array]') {

// The value is an array. Stringify every element. Use null as a placeholder
// for non-JSON values.

                length = value.length;
                for (i = 0; i < length; i += 1) {
                    partial[i] = str(i, value) || 'null';
                }

// Join all of the elements together, separated with commas, and wrap them in
// brackets.

                v = partial.length === 0
                    ? '[]'
                    : gap
                    ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']'
                    : '[' + partial.join(',') + ']';
                gap = mind;
                return v;
            }

// If the replacer is an array, use it to select the members to be stringified.

            if (rep && typeof rep === 'object') {
                length = rep.length;
                for (i = 0; i < length; i += 1) {
                    if (typeof rep[i] === 'string') {
                        k = rep[i];
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            } else {

// Otherwise, iterate through all of the keys in the object.

                for (k in value) {
                    if (Object.prototype.hasOwnProperty.call(value, k)) {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            }

// Join all of the member texts together, separated with commas,
// and wrap them in braces.

            v = partial.length === 0
                ? '{}'
                : gap
                ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}'
                : '{' + partial.join(',') + '}';
            gap = mind;
            return v;
        }
    }

// If the JSON object does not yet have a stringify method, give it one.

    if (typeof JSON.stringify !== 'function') {
        JSON.stringify = function (value, replacer, space) {

// The stringify method takes a value and an optional replacer, and an optional
// space parameter, and returns a JSON text. The replacer can be a function
// that can replace values, or an array of strings that will select the keys.
// A default replacer method can be provided. Use of the space parameter can
// produce text that is more easily readable.

            var i;
            gap = '';
            indent = '';

// If the space parameter is a number, make an indent string containing that
// many spaces.

            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' ';
                }

// If the space parameter is a string, it will be used as the indent string.

            } else if (typeof space === 'string') {
                indent = space;
            }

// If there is a replacer, it must be a function or an array.
// Otherwise, throw an error.

            rep = replacer;
            if (replacer && typeof replacer !== 'function' &&
                    (typeof replacer !== 'object' ||
                    typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify');
            }

// Make a fake root object containing our value under the key of ''.
// Return the result of stringifying the value.

            return str('', {'': value});
        };
    }


// If the JSON object does not yet have a parse method, give it one.

    if (typeof JSON.parse !== 'function') {
        JSON.parse = function (text, reviver) {

// The parse method takes a text and an optional reviver function, and returns
// a JavaScript value if the text is a valid JSON text.

            var j;

            function walk(holder, key) {

// The walk method is used to recursively walk the resulting structure so
// that modifications can be made.

                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }


// Parsing happens in four stages. In the first stage, we replace certain
// Unicode characters with escape sequences. JavaScript handles many characters
// incorrectly, either silently deleting them, or treating them as line endings.

            text = String(text);
            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function (a) {
                    return '\\u' +
                        ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }

// In the second stage, we run the text against regular expressions that look
// for non-JSON patterns. We are especially concerned with '()' and 'new'
// because they can cause invocation, and '=' because it can cause mutation.
// But just to be safe, we want to reject all unexpected forms.

// We split the second stage into 4 regexp operations in order to work around
// crippling inefficiencies in IE's and Safari's regexp engines. First we
// replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
// replace all simple value tokens with ']' characters. Third, we delete all
// open brackets that follow a colon or comma or that begin the text. Finally,
// we look to see that the remaining characters are only whitespace or ']' or
// ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

            if (/^[\],:{}\s]*$/
                    .test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
                        .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
                        .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

// In the third stage we use the eval function to compile the text into a
// JavaScript structure. The '{' operator is subject to a syntactic ambiguity
// in JavaScript: it can begin a block or an object literal. We wrap the text
// in parens to eliminate the ambiguity.

                j = eval('(' + text + ')');

// In the optional fourth stage, we recursively walk the new structure, passing
// each name/value pair to a reviver function for possible transformation.

                return typeof reviver === 'function'
                    ? walk({'': j}, '')
                    : j;
            }

// If the text is not JSON parseable, then a SyntaxError is thrown.

            throw new SyntaxError('JSON.parse');
        };
    }
}());


function makeCallback(method,target){
	return function(){method.apply(target,arguments);}
}
/*
 * actionPager:一个用来基于hash触发注册的方法的URL hash侦听器
 * 用于解决浏览历史的问题
 */
var actionPager = {
	lashHash:'',
	callbacks:[],
	safariHistory:false,
	msieHistory:false,
	ajaxifyClassName:'',
	ajaxifyRoot:'',
	init:function(ajaxifyClass,ajaxifyRoot,startingHash){
		this.ajaxifyClassName = ajaxifyClass || 'ADSAction';
		this.ajaxifyRoot = ajaxifyRoot || '';
		if(/Safari/i.test(navigator.userAgent)){
			this.safariHistory = [];
		}else if(/MSIE/i.test(navigator.userAgent)){
			this.msieHistory = document.createElement('iframe');
			this.msieHistory.setAttribute('id','msieHistory');
			this.msieHistory.setAttribute('name','msieHistory');
			setStyleById(this.msieHistory,{
				'width':'100px',
				'height':'100px',
				'border':'1px solid black',
				'visibility':'visible',
				'zIndex':'-1'
			});
			document.body.appendChild(this.msieHistory);
			this.msieHistory = frames['msieHistory'];
		}
		this.ajaxifyLinks();
		var location = this.getLocation();
		if(!location.hash && !startingHash){
			startingHash = 'start';
		}
		ajaxHash = this.getHashFromURL(location.hash) || startingHash;
		this.addBackButtonHash(ajaxHash);
		var watchCallback = makeCallback(this.watchLocationForChange,this);
		window.setInterval(watcherCallback,200);
	},
	ajaxifyLinks:function(){
		links = getByClassName(this.ajaxifyClassName);
		for(var i = 0; i < links.length; i++){
			if(hasClass(links[i],'ADSActionPagerModified')){
				continue;
			}
			links[i].setAttribute('href',this.convertURLToHash(links[i].getAttribute('href')));
			addClass(links[i],'ADSActionPagerModified');
			addEvent(links[i],'click',function(){
				if(this.href && this.href.indexOf('#') > -1){
					actionPager.addBackButtonHash(actionPager.getHashFromURL(this.href));
				}
			});
		}
	},
	addBackButtonHash:function(ajaxHash){
		if(!ajaxHash) return false;
		if(this.safariHistory !== false){
			if(this.safariHistory.length == 0){
				this.safariHistory[window.history.length] = ajaxHash;
			}else{
				this.safariHistory[window.history.length+1] = ajaxHash;
			}
			return false;
		}else if(this.msieHistory !== false){
			this.msieHistory.document.execCommand('Stop');
			this.msieHistory.location.href = '/fakepage?hash=' + ajaxHash + '&title=' + document.title;
			return true;
		}else{
			var timeoutCallback = makeCallback(function(){
				if(this.getHashFromURL(window.location.href) != ajaxHash){
					window.location.replace(location.href + '#' +ajaxHash);
				}
			},this);
			setTimeout(timeoutCallback,200);
			return true;
		}
	},
	watchLocationForChange:function(){
		var newHash;
		if(this.safariHistory !== false){
			if(this.safariHistory[history.length]){
				newHash = this.safariHistory[history.length];
			}
		}else if(this.msieHistory !== false){
			newHash = this.msieHistory.location.href.split('&')[0].split('=')[1];
		}else if(location.hash != ''){
			newHash = this.getHashFromURL(window.location.href);
		}
		if(newHash && this.lastHash != newHash){
			if(this.msieHistory !== false && this.getHashFromURL(window.location.href) != newHash){
				location.hash = newHash;
			}
			try{
				this.executeListeners(newHash);
				this.ajaxifyLinks();
			}catch(e){
				alert(e);
			}
			this.lastHash = newHash;
		}
	},
	register:function(regex,method,context){
		var obj = {'regex':regex};
		if(context){
			obj.callback = function(matches){
				method.apply(context,matches);
			}
		}else{
			obj.callback = function(matches){
				method.apply(window,matches);
			}
		}
		this.callback.push(obj)
	},
	convertURLToHash:function(url){
		if(!url){
			return '#';
		}else if(url.indexOf('#')!=-1){
			return url.split('#')[1];
		}else{
			if(url.indexOf('://')!=-1){
				url = url.match(/:\/\/[^\/]+(.*)/)[1];
			}
			return '#' + url.substr(this.ajaxifyRoot.length)
		}
	},
	getHashFromURL:function(){
		if(!url || url.indexOf("#") == -1){return '';}
		return url.split("#")[1];
	},
	getLocation:function(){
		if(!window.location.hash){
			var url = {domain:null,hash:null}
			if(window.location.href.indexOf("#") > -1){
				parts = window.location.href.split("#")[1];
				url.domain = parts[0];
				url.hash = parts[1];
			}else{
				url.domain = window.location;
			}
			return url;
		}
		return window.location;
	},
	executeListener:function(hash){
		for(var i in this.callback){
			if((matches = hash.match(this.callback[i].regex))){
				this.callback[i].callback(matches);
			}
		}
	}
}

/*
 * clone():复制对象
 *
 */
function clone(obj){
	if(typeof obj != 'object') return obj;
	if(typeof obj == null) return obj;
	var newObj = {};
	for(var i in obj){
		obj[i] = newObj[i];
	}
	return newObj;
}

/*
 * ajaxQueue():ajax队列
 *
 */
var requestQueue = [];
function ajaxQueue(url,options,queue){
	options = queue || 'default';
	options = clone(options) || {};
	if(!requestQueue[queue]) requestQueue[queue] = [];
	var userCompleteListener = options.completeListener;
	
	options.completeListener = function(){
		if(userCompleteListener){
			userCompleteListener.apply(this,arguments);
		}
		requestQueue[queue].shift();
		
		if(requestQueue[queue][0]){
			var q = requestQueue[queue][0].requset.send(requestQueue[queue][0].send)
		}
	}

	var userErrorListener = options.errorListener;
	options.errorListener = function(){
		if(userErrorListener){
			userErrorListener.apply(this,arguments);
		}
		requestQueue[queue].shift();
		if(requestQueue[queue].length){
			var q = requestQueue[queue].shift();
			q.request.abort();
			var fakeRequest = {};
			fakeRequest.status = 0;
			fakeRequest.readyState = 4;
			fakeRequest.responseText = null;
			fakeRequest.responseXML = null;
			fakeReqeust.statusText = 'A request in the queue recieved an error';
			q.error.apply(fakeRequest);
		}
	}
	requestQueue[queue].push({
		request:ajaxRequest(url,options),
		send:options.send,
		error:options.errorListener
	});
	if(reqeustQueue[queue].length == 1){
		ajaxRequest(url,options);
		send(options.send);
	}
}