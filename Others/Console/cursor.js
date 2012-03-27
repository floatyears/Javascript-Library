function getCursorIndex(elem) {
	var index = 0;
	if (document.selection) {
		elem.focus();
		/*
		if(elem.nodeName.toLowerCase() == 'textarea'){
			var sel2 = sel.duplicateText(elem);
			var index = -1;
			while(sel2.inRange(sel)){
				sel2.moveStart('character');
				index++;
			}
		}else if(elem.nodeName.toLowerCase() == 'input'){
			sel.moveStart('character',-elem.value.length);
			index = sel.text.length;
		}
		*/
		var sel = document.selection.createRange();
		sel.moveStart("character", -elem.value.length);
		index = sel.text.length;

	} else if (elem.selectionStart || elem.selectionStart == "0") index = elem.selectionStart;
	console.log(index);
	return index
}

function setCursorIndex(elem,index){
	if(elem.setSelectionRange){
		elem.focus();
		elem.setSelectionRange(index,index);
	}
	else if(elem.createRange){
		var range = elem.createRange();
		range.collapse(true);
		range.moveEnd('character',index);
		range.moveStart('character',index);
		range.select();
	}
}
function getCursorPos(elem) {
	if (document.selection) {
		elem.focus();
		var sel = document.selection.createRange();
		return {
			left: sel.boundingLeft,
			top: sel.boundingTop,
			bottom: sel.boundingTop + sel.boundingHeight
		}
	} else if (document.createRange) {
		//var that = this;
		var cloneDiv = "{$clone_div}",
			cloneLeft = "{$cloneLeft}",
			cloneFocus = "{$cloneFocus}",
			cloneRight = "{$cloneRight}";
		var none = '<span\u00a0style="white-space:pre-wrap;">\u00a0</span>';
		var div = elem[cloneDiv] || document.createElement("div"),
			focus = elem[cloneFocus] || document.createElement("span");
		var text = elem[cloneLeft] || document.createElement("span");
		var offset = Offset(elem),
			index = getCursorIndex(elem),
			focusOffset = {
				left: 0,
				top: 0
			};
		if (!elem[cloneDiv]) {
			elem[cloneDiv] = div, elem[cloneFocus] = focus;
			elem[cloneLeft] = text;
			div.appendChild(text);
			div.appendChild(focus);
			document.body.appendChild(div);
			focus.innerHTML = "|";
			focus.style.cssText = "display:inline-block;width:0px;overflow:hidden;z-index:-100;word-wrap:break-word;word-break:break-all;";
			div.className = cloneStyle(elem);
			div.style.cssText = "visibility:hidden;display:inline-block;position:absolute;z-index:-100;word-wrap:break-word;word-break:break-all;overflow:hidden;"
		}
		div.style.left = Offset(elem).left + "px";
		div.style.top = Offset(elem).top + "px";
		var strTmp = elem.value.substring(0, index).replace(/</g, "<").replace(/>/g, ">").replace(/\n/g, "<br/>").replace(/\s/g, none);
		text.innerHTML = strTmp;
		focus.style.display = "inline-block";
		try {
			focusOffset = Offset(focus)
		} catch (e) {}
		focus.style.display = "none";
		return {
			left: focusOffset.left,
			top: focusOffset.top,
			bottom: focusOffset.bottom
		}
	}
}

function Offset(elem) {  
    var box = elem.getBoundingClientRect(), doc = elem.ownerDocument, body = doc.body, docElem = doc.documentElement;  
    var clientTop = docElem.clientTop || body.clientTop || 0, clientLeft = docElem.clientLeft || body.clientLeft || 0;  
    var top = box.top + (self.pageYOffset || docElem.scrollTop) - clientTop, left = box.left + (self.pageXOffset || docElem.scrollLeft) - clientLeft;  
    return {  
        left: left,  
        top: top,  
        right: left + box.width,  
        bottom: top + box.height  
    };  
}

// 克隆元素样式并返回类  
 function cloneStyle(elem, cache) {  
    if (!cache && elem['${cloneName}']) return elem['${cloneName}'];  
    var className, name, rstyle = /^(number|string)$/;  
    var rname = /^(content|outline|outlineWidth)$/; //Opera: content; IE8:outline && outlineWidth  
    var cssText = [], sStyle = elem.style;  
    /*
    for (name in sStyle) {  
        if (!rname.test(name)) {  
            val = getStyle(elem, [name])[0];  
            if (val !== '' && rstyle.test(typeof val)) { // Firefox 4  
                namename = name.replace(/([A-Z])/g, "-$1").toLowerCase();  
                cssText.push(name);  
                cssText.push(':');  
                cssText.push(val);  
                cssText.push(';');  
            };  
        };  
    };  
    cssTextcssText = cssText.join('');
    */  
    elem['${cloneName}'] = className = 'clone' + (new Date).getTime();  
    //addStyleSheet('.' + className + '{' + cssText + '}');  
    addCSSRule(className,sStyle);
    return className;  
}