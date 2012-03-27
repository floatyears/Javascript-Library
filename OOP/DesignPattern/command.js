//ReversibleCommand interface
var ReversibleCommand = new Interface('ReversibleCommand',['execute','undo']);

//Movement commands
var MoveUp = function(cursor){
	this.cursor = cursor;
}
MoveUp.prototype = {
	constructor:MoveUp,
	execute:function(){
		this.cursor.move(0,-10);
	},
	undo:function(){
		this.cursor.move(0,10);
	}
}

var MoveDown = function(cursor){
	this.cursor = cursor;
}
MoveDown.prototype = {
	constructor:MoveDown,
	execute:function(){
		this.cursor.move(0,10);
	},
	undo:function(){
		this.cursor.move(0,-10);
	}
}

var MoveLeft = function(cursor){
	this.cursor = cursor;
}
MoveLeft.prototype = {
	constructor:MoveLeft,
	execute:function(){
		this.cursor.move(-10,0);
	},
	undo:function(){
		this.cursor.move(10,0);
	}
} 

var MoveRight = function(cursor){
	this.cursor = cursor;
}
MoveRight.prototype = {
	constructor:MoveRight,
	execute:function(){
		this.cursor.move(10,0);
	},
	undo:function(){
		this.cursor.move(-10,0);
	}
}

//Cursor Class
var Cursor = function(width,height,parent){
	this.width = width;
	this.height = height;
	this.position = {x:width/2,y:height/2}

	this.canvas = document.createElement('canvas');
	this.canvas.width = this.width;
	this.canvas.height = this.height;
	parent.appendChild(this.canvas);

	this.ctx = this.canvas.getContext('2d');
	this.ctx.fillStyle = '#cc0000';
	this.move(0,0);
}
Cursor.prototype.move = function(x,y){
	this.position.x = x;
	this.position.y = y;

	this.ctx.clearRect(0,0,this.width,this.height);
	this.ctx.fillRect(this.position.x,this.position.y,3,3);
}

//UndoDecorator Class
var UndoDecorator = function(command,undoStack){
	this.command = command;
	this.undoStack = undoStack;
}
UndoDecorator.prototype = {
	execute:function(){
		this.undoStack.push(this.command);
		this.command.execute();
	},
	undo:function(){
		this.command.undo();
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
var UndoButton = function(label,parent,undoStack){
	this.element = document.createElement('button');
	this.element.innerHTML = label;
	parent.appendChild(this.element);

	addEvent(this.element,'click',function(){
		if(undoStack.length === 0) return;
		var lastCommand = undoStack.pop();
		lastCommand.undo();
	})
}

