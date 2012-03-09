Function.prototype.method = function(name,fn){
	this.prototype[name] = fn;
	return this;
}
if(!Array.prototype.forEach){
	Array.method('forEach',function(fn,thisObj){
		var scope = thisObj || window;
		for (var i = this.length - 1; i >= 0; i--) {
			fn.call(scope,this[i],i,this);
		};
	});
}
if(!Array.prototype.filter){
	Array.method('filter',function(fn,thisObj){
		var scope = thisObj || window;
		var a = [];
		for (var i = this.length - 1; i >= 0; i--) {
			if(fn.call(scope,this[i],i,this)){
				a.push(this[i]);
			}
		};
		return a;
	})
}

window.DED = window.DED || {};
DED.util = DED.util || {};
DED.util.Observer = function(){
	this.fns = [];
}
DED.util.Observer.prototype = {
	constructor:DED.util.Observer,
	subscribe:function(fn){
		this.fns.push(fn);
	},
	unsubscribe:function(fn){
		/*
		for (var i = this.fns.length - 1; i >= 0; i--) {
			if(this.fns[i] === fn){
				this.fns.splice(i,1);
			}
		};
		*/
		ths.fns.filter(function(el){
			if(el !== fn){
				return el;
			}
		});
	},
	fire:function(o){ //fire函数并没有以this为对象，因为fire只是一个触发器，将fns一一触发，而并不向fire函数传递参数。
		/*
		for (var i = this.fns.length - 1; i >= 0; i--) {
			this.fns[i].call(this);
		};
		*/
		this.fns.forEach(function(el){
			el(o);
		});
	}
}

var asyncRequest = (function(){
	function handleReadyState(o,callback){
		var poll = window.setInterval(function(){
			if(o && o.readyState == 4){
				window.clearInterval(poll);
				if(callback){
					callback(o);
				}
			}
		},50);
	}
	var getXHR = function(){
		var http;
		try{
			http = new XMLHttpRequest;
			getXHR = function(){
				return new XMLHttpRequest;
			}
		}catch(e){
			var msxml = ['MSXML2.XMLHTTP.3.0','MSXML2.XMLHTTP','Microsoft.XMLHTTP'];
			for (var i = msxml.length - 1; i >= 0; i--) {
				try{
					http = new ActiveXObject(msxml[i]);
					getXHR = function(){
						return new ActiveXObject(msxml[i]);
					}
					break;
				}
				catch(e){}
			};
		}
		return http;
	}
	return function(method,uri,callback,postData){
		var http = getXHR();
		http.open(method,uri,true);
		handleReadyState(http,callback);
		http.send(postData || null);
		return http;
	}
})();

//队列对象
DED.Queue = function(){
	this.queue = [];
	this.onComplete = new DED.util.Observer;
	this.onFailure = new DED.util.Observer;
	this.onFlush = new DED.util.Observer;

	this.retryCount = 3;
	this.currentRetry = 0;
	this.paused = false;
	this.timeout = 5000;
	this.conn = {};
	this.timer = {};
}
DED.Queue.method('flush',function(){
	if(!this.queue.length > 0){
		return;
	}
	if(this.paused){
		this.paused = true;
		return;
	}
	var that = this;
	this.currentRetry++;
	//停止请求
	var abort = function(){

		//this.conn为XHR对象，具有abort属性。
		that.conn.abort();
		if(that.currentRetry == that.retryCount){ //重试次数，超过次数即请求失败
			that.onFailure.fire();
			that.currentRetry = 0;
		}else{
			that.flush(); //若没有超过次数，则再次请求。
		}
	};
	//超时时间
	this.timer = window.setTimeout(abort,this.timeout);
	//回调函数，完成请求时的回调函数
	var callback = function(o){
		window.clearTimeout(that.timer);
		that.currentRetry = 0;
		that.queue.shift();
		that.onFlush.fire(o.responseText);
		if(that.queue.length == 0){
			that.onComplete.fire(o);
			return;
		}
		that.flush();
	};
	this.queue[0].options['htmlResponseListener'] = callback;
	//发送http请求。
	this.conn = ajaxRequest(this.queue[0]['url'],this.queue[0].options);
}).method('setRetryCount',function(count){
	this.retryCount = count;
}).method('setTimeout',function(time){
	this.timeout = time;
}).method('add',function(o){
	this.queue.push(o);
}).method('paused',function(){
	this.paused = true;
}).method('dequeue',function(){
	this.queue.pop();
}).method('clear',function(){
	this.queue = [];
})