/*
 * DOM Manipulation Functions
 *
 */

/*
 *$():
 *获取一个或者一组DOM节点，可传入参数为id或者DOM节点，支持多个参数的传递。
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

function camlize(prop){
	return prop.replace(/\-(\w)/g,function(strMatch,p1){
		return p1.toUpperCase();
	});
}
function uncamlize(prop,sep){
	return prop.replace(/[A-Z]/g,function(strMatch){
		return ((sep?sep:"-") + strMatch.toLowerCase());
	})
}

/*
 * arguments:
 * 
 *
 */

function getStyle(elem,props,pseudoEl){
	var styles = {};
	if(elem.currentStyle){
		for(var i = 0; i < props.length; i++){
			if(!(styles[props[i]] = elem.currentStyle[props[i]])) continue;
		}
	}
	if(window.getComputedStyle){
		for(var i = 0; i < props.length; i++){
			if(!(styles[props[i]] = window.getComputedStyle(elem,pseudoEl).getPropertyValue(props[i]))) continue;
		}
		
	}
	return styles;
}

function setStyleById(elem,styles){
	if(!(elem = $(elem))) return false;
	for(var prop in styles){
		if(!styles.hasOwnProperty(prop)) continue;
		if(elem.style.setProperty){
			elem.style.setProperty(camlize(prop),styles[prop],'important');
			//console.log(camlize(prop));
		}else{
			elem.style[camelize(prop)] = styles[prop];
		}
	}
}


function setStyleByClassName(className,styles){
	if(!(elems = getByClassName(className))) return false;
	for(var i = 0; i < elems.length; i++){
		setStyleById(elems[i],styles);
	}
}

function getChildren(elem){
	var elems = [];
	for(var i = 0,children = elem.childNodes, len = children.length; i < len; i ++){
		if (children[i].nodeType == 1){
			elems.push(children[i]);
		}
	}
	return elems;
}

function hasClass(elem,className){
	classes = elem.className.split(/\s+/g);
	for(var i = 0; i < classes.length; i++){
		if(classes[i] == className){
			return true;
		}
	}
	return false;
}

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
function addEvent(elem,type,func){
	if(elem.attachEvent){
		elem['e'+type+func] = func;
		elem[type+func] = function(){elem['e'+type+func](window.event);}
		elem.attachEvent('on'+type,elem[type+func]);
	}else if(elem.addEventListener){
		elem.addEventListener(type,func,false);
	}else{
		alert('Handler can not be attached!');
	}
	//return elem.attachEvent?elem.attachEvent('on'+type,func):elem.addEventListener(type,func);
}

/*
 *arguments:
 *--elem: the element to animate.
 *--from: object,the element's starting properties,or has no value
 *--to: object,the element's ending state.
 */

function animate(elem,from,to,dur,fx,func,fps){
	fps = fps || 25;
	var sep = parseInt(1000/fps),curTime = 0, times = parseInt(fps*dur), changes = {}, curVal = {},dur = dur*1000;
	for(var prop in to){
		var props = [];
		props.push(prop);
		from[prop] = parseInt((from[prop]?from[prop]:getStyle(elem,props)[prop]).replace(/\D*/g,''));
		to[prop] = parseInt(to[prop].replace(/\D*/g,''));
		changes[prop] = parseInt(to[prop] - from[prop]);
 	}
	if(getStyle(elem,['display'])['display'] == 'none'){setStyleById(elem,{'display':'block'});}
	/*
	if(Queue.checkQueue(elem)){
		console.log('the queue is not empty');
		return;
	}*/
	var animateId = setInterval(function(){
		if(curTime > dur) {
			clearAnimate(elem,animateId)
			console.log('animate was dequeue');
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
	Queue.addQueue(elem,animateId,dur);
	//console.log('');
}

function clearAnimate(elem,animateId){
	clearInterval(animateId);
	Queue.deQueue(elem,animateId);
}

var Queue = (function(){
	//var queues = [];
	var queue = [];
	return {
		queue:queue,
		checkQueue:function(elem){
			var n = 0;
			for(var i = 0, len = queue.length; i < len; i++){
				if(queue[i] && queue[i].element == elem){
					n++;
				}
			}
			if(n > 1){
				n = 0;
				return true;
			}
		},
		addQueue:function(elem,animateId,dur,delay){
			var n = 0;
			if(queue.length > 0){
				for(var i = 0, len = queue.length; i < len; i++){
					if(queue[i].element == elem){
						n++;
						//console.log(len);
						queue[i].animateId.push(animateId);
						var a = queue[i].animateId;
						clearInterval(a[a.length-2]);
						return;
						//console.log(elem.childNodes.length);
					}
					//console.log(len);
				}
				queue.push({element:elem,animateId:[animateId],duration:dur});
			}else{
				queue.push({element:elem,animateId:[animateId],duration:dur});
			}
			
			
			/*if(n > 1){
				n = 0;
				this.deQueue(animateId);
				console.log(Queue.queue);
			}else{*/

				/*console.log(Queue.queue);*/
			
			
			//console.log(queue);
			//queue[animateId] = elem;
			//setTimeout(deQueue(animateId),delay?delay+dur:dur);
		},
		deQueue:function(elem,animateId){
			for(var i = 0, len = queue.length; i < len; i++){
				if(queue[i] && queue[i].elem == elem){
					clearInterval(animateId);
					queue[i].animateId.splice(i,1);
					console.log(Queue.queue);
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

function init(){
	var ul = getByClassName('drop');
	for(var i = 0; i < ul.length; i++){
		setStyleById(ul[i],{'display':'none','overflow':'hidden'});
	}
}
window.onload = function(){
	init();
	var menu = document.getElementsByClassName('menu')[0],lis = getChildren(menu);
	for(var i = 0, len = lis.length; i < len; i++){
		addEvent(lis[i],'mouseover',function(e){
			//var event = e || window.event;
			var ul = getByClassName('drop',this)[0];
			//animate(ul,{'height':'0px','width':'104px'},{'height':'120px','width':'104px'},1,Easing.easeInQuad);
			animate(ul,{'height':''},{'height':'120px'},1,Easing.easeLine);
			//setStyleById(ul,{'display':'block'});
		});
		addEvent(lis[i],'mouseout',function(e){
			var ul = getByClassName('drop',this)[0];
			//setStyleById(ul,{'display':'none'});
			//animate(ul,{'height':'','width':''},{'height':'0px','width':'0px'},2,Easing.easeInQuad);
			animate(ul,{'height':''},{'height':'0px'},1,Easing.easeLine);
		});
	}
}