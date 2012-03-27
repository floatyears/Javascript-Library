//ReversibleCommand interface
var ReversibleCommand = new Interface('ReversibleCommand',['execute']);

//Movement commands
var MoveUp = function(cursor){
	this.cursor = cursor;
}
MoveUp.prototype = {
	constructor:MoveUp,
	execute:function(){
		this.cursor.move(0,-10);
	}
}

var MoveDown = function(cursor){
	this.cursor = cursor;
}
MoveDown.prototype = {
	constructor:MoveDown,
	execute:function(){
		this.cursor.move(0,10);
	}
}

var MoveLeft = function(cursor){
	this.cursor = cursor;
}
MoveLeft.prototype = {
	constructor:MoveLeft,
	execute:function(){
		this.cursor.move(-10,0);
	}
} 

var MoveRight = function(cursor){
	this.cursor = cursor;
}
MoveRight.prototype = {
	constructor:MoveRight,
	execute:function(){
		this.cursor.move(10,0);
	}
}

//Cursor Class
var Cursor = function(width,height,parent){
	this.width = width;
	this.height = height;
	this.commandStack = [];

	this.canvas = document.createElement('canvas');
	this.canvas.width = this.width;
	this.canvas.height = this.height;
	parent.appendChild(this.canvas);

	this.ctx = this.canvas.getContext('2d');
	this.ctx.strokeStyle = '#cc0000';
	this.move(0,0);
}
Cursor.prototype = {
	move : function(x,y){
		var that = this;
		this.commandStack.push(function(){that.lineTo(x,y);});
		this.executeCommands();
	},
	lineTo:function(x,y){
		this.position.x += x;
		this.position.y +=y;
		this.ctx.lineTo(this.position.x,this.position.y);
	},
	executeCommands:function(){
		this.position = {x:this.width/2,y:this.height/2};
		this.ctx.clearRect(0,0,this.width,this.height); //Clear the canvas
		this.ctx.beginPath();
		this.ctx.moveTo(this.position.x,this.position.y);
		for(var i = 0, len = this.commandStack.length; i < len; i++){
			this.commandStack[i]();
		}
		this.ctx.stroke();
	},
	undo:function(){
		this.commandStack.pop();
		this.executeCommands();
	}
}

//CommandButton Class
var CommandButton = function(label,command,parent){
	Interface.ensureImplements(command,ReversibleCommand);
	this.element = document.createElement('button');
	this.element.innerHTML = label;
	parent.appendChild(this.element);

	addEvent(this.element,'click',function(){
		command.execute();
	})
}

//UndoButton Class
var UndoButton = function(label,parent,cursor){
	this.element = document.createElement('button');
	this.element.innerHTML = label;
	parent.appendChild(this.element);

	addEvent(this.element,'click',function(){
		cursor.undo();
	})
}

