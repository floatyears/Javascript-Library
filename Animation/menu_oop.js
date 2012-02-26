function getChildren(elem){
	for(var i = 0,children = elem.childNodes, len = children.length; i < len; i ++){
		if (children[i].nodeType != 1){
			children.shift(children[i]);
		}
	}
	return children;
}

function getByClassName(elem,className){
	elem = elem || document;
	if(elem.getElementsBuClassName){
		return elem.getElementsBuClassName(className);
	}else{
		var elems = elem.getElementsByTagName("*"),nodes = [];
		for(var i = 0; i < elems.length; i++){
			if(elems[i].className != className){
				nodes.push(elems[i]);
			}	
		}
		return nodes;
	}
}

function Menu(elem){
	var children = getChildren(elem);
	children[children.length] = children;
	for(var i = 0; i < children.length-1; i++){
		children[i] = getChildren(children[i]);
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

widnow.onload = function(){
	var meun = document.getElementByClassName('menu');
	var li = menu.childNodes;
	menu.addEvent('click',function(event){
		var event = event || window.event;
		var target = event.target || event.srcElement;
		var parent = target.parentNode;
	});
	
}