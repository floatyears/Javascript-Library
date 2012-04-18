package
{
	import flash.display.Sprite;
	import flash.events.Event;
	import flash.events.KeyboardEvent;
	import flash.text.TextField;
	import flash.text.TextFieldType;
	import flash.text.TextFormat;
	import flash.text.TextFormatAlign;
	import flash.utils.*;
	
	public class InputCount extends Sprite
	{
		private var inputTextField:TextField = new TextField();
		private var timeTextField:TextField = new TextField();
		private var format:TextFormat = new TextFormat();
		private var time:uint = 10;
		private var count:uint = 0;
		private var interval:uint;
		public function InputCount()
		{
			init();
			addChild(inputTextField);
			//trace('Hello Wordl!');
			this.stage.addEventListener(KeyboardEvent.KEY_DOWN,inputHandler);
			interval = setInterval(Time,1000)
		}
		private function init():void{
			//inputTextField.x = 10;
			inputTextField.y = 30;
			inputTextField.height = 20;
			inputTextField.width = 300;
			inputTextField.background = true;
			inputTextField.border = false;
			inputTextField.wordWrap = true;
			//inputTextField.text = 'Hello World';
			
			format.font = 'Tohama';
			format.color = '0xFF0000';
			format.size = 14;
			format.underline = true;
			
			inputTextField.defaultTextFormat = format;
			
			timeTextField.y = 10;
			timeTextField.width = 300;
			timeTextField.height = 20;
			timeTextField.border = true;
		}
		private function inputHandler(event:KeyboardEvent):void{
			
			//trace("keyDownHandler: " + event.keyCode);
			inputTextField.text = String.fromCharCode(event.keyCode.toString());
			format.leftMargin = Math.random()*300;
			var size:uint = 14 + Math.random()*50;
			format.size = size;
			inputTextField.height = size;
			inputTextField.y = 30+Math.random()*270;
			inputTextField.defaultTextFormat = format;
			addChild(inputTextField);
			count++;
		}
		private function Time():void
		{
			timeTextField.text = (time?time--:Timeout()).toString();
			addChild(timeTextField);
		}
		private function Timeout():String
		{
			//var ret:String = 'The Total Number of the input letters is: ' + count.toString();
			clearInterval(interval);
			this.stage.removeEventListener(KeyboardEvent.KEY_DOWN,inputHandler);
			return 'The Total Number of the input letters is: ' + count.toString();
		}
	}
}