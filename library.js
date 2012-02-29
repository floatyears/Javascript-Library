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