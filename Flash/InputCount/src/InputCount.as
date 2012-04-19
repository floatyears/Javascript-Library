package
{
//import fl.controls.Button;
	import flash.display.Sprite;
	import flash.events.Event;
	import flash.events.KeyboardEvent;
	import flash.events.MouseEvent;
	import flash.events.TextEvent;
	import flash.events.TimerEvent;
	import flash.geom.Point;
	import flash.text.TextField;
	import flash.text.TextFieldType;
	import flash.text.TextFormat;
	import flash.text.TextFormatAlign;
	import flash.utils.*;
	
	
	public class InputCount extends Sprite
	{
		//private var inputTextField:TextField = new TextField();
		private var timeTextField:TextField = new TextField();
		//private var format:TextFormat = new TextFormat();
		private var timeFormat:TextFormat = new TextFormat();
		private var time:uint;
		private var count:uint;
		private var interval:uint;
		private var fps:uint = 30;
		private var vertical:uint = 30;
		private var currentCount:uint = 0;
		public function InputCount()
		{
			init();
			//addChild(inputTextField);
			//setTimeout(,1000);
			//trace('Hello Wordl!');
			stage.addEventListener(KeyboardEvent.KEY_DOWN,inputHandler);
			Time()
		}
		
		/*
		 * init():初始化时间显示
		 *
		 */
		private function init():void{
			
			time = 60;
			count = 0;
			
			timeTextField.y = 10;
			timeTextField.width = 300;
			timeTextField.height = 20;
			timeTextField.border = true;
			
			
			timeFormat.align = 'center';
			
			timeTextField.defaultTextFormat = timeFormat;
			timeTextField.text = '即将开始计时，请做好准备！';
			addChild(timeTextField);
		}
		
		/*
		 * inputHandler():监听键盘输入
		 */
		private function inputHandler(event:KeyboardEvent):void{
			
			//trace("keyDownHandler: " + event.keyCode);
			var char:String = String.fromCharCode(event.charCode.toString());

			currentCount > 30 ? setTimeout(optimization,100):Animation(char);
			
			function optimization():void
			{
				Animation(char);
			}
			
			//this.addChild(inputTextField);
			currentCount++;
			count++;
		}
		/*
		 * Time():倒计时处理函数。
		 *
		 */
		private function Time():void
		{
			//interval = 0;
			interval = setInterval(function():void{
				timeTextField.text = time?(time--)>10?'00:00:'+time.toString():'00:00:0'+time.toString():Timeout();
				//addChild(timeTextField);
			},1000)
		}
		
		/*
		 * Timeout():时间到的处理函数
		 *
		 */
		private function Timeout():String
		{
			//var ret:String = 'The Total Number of the input letters is: ' + count.toString();
			clearInterval(interval);
			this.stage.removeEventListener(KeyboardEvent.KEY_DOWN,inputHandler);
			onecMore();
			return 'Timeout! The Total Number of the inputed letters is: ' + count.toString();
		}
		
		/*
		 * Animation():定义字符的动画
		 * @param char表示键盘敲击的字符
		 */
		private function Animation(char:String):void
		{
			var pos:String = Math.round(Math.random()) == 0 ? 'y': 'x';
			var animateText:TextField = charStyle(char,pos);
			var t:Timer = new Timer(Math.round(1/fps)*1000);
			
			var SPEED:Number = 5;
			var lastTime:int = getTimer();
			
			t.addEventListener(TimerEvent.TIMER,onTimer);
			t.start();
			
			function onTimer(event:TimerEvent):void //
			{
				var time:int = getTimer();
				(animateText[pos] < 0) ? (removeChild(animateText) || currentCount--):animateStyle(time);
				
				//lastTime = time; //添加这句代码后才才是匀速运动，不添加就是匀加速运动。
				
				//animateText.y += vertical;
				vertical = vertical >= 270 ? 30 :vertical + 20;
				event.updateAfterEvent();
			}
			function animateStyle(time:int):void
			{
				
				animateText[pos] -= SPEED*(time - lastTime) / 1000;
				var size:uint = animateText.width/2;
				var point:Point = new Point(size+1,size+1);
				//var point:Point = new Point(0,0);
				animateText.alpha  =  animateText[pos] / 300*0.5 + 0.5;
				var regPiont_1:Point = animateText.localToGlobal(point);
				
				//regPiont.x = animateText.x;
				//regPiont.y = animateText.y;
				animateText.rotationZ = animateText[pos] / 300 * 360;
				var regPoint_2:Point = animateText.localToGlobal(point);
				animateText.x = animateText.x - ( regPoint_2.x - regPiont_1.x);
				animateText.y = animateText.y - ( regPoint_2.y - regPiont_1.y);
				
				
			}
			
		}
		
		/*
		 * charStyle():定义每个输出字符的样式。
		 * @param char 表示键盘敲击的字符。
		 * @param pos 表示字母运动的方向。
		 */
		private function charStyle(char:String,pos:String):TextField
		{
			var animateText:TextField = new TextField();
			animateText.addEventListener(TextEvent.TEXT_INPUT,textInputHandler);
			function textInputHandler(e:TextEvent):void
			{
				animateText.text = e.text;
			}
			var animateFormat:TextFormat = new TextFormat();
			var colorStr:String = Math.floor(Math.random()*256).toString(16);
			var size:uint = 10+Math.random()*20
			//animateFormat.color = '0x'+ colorStr + colorStr + colorStr;
			animateFormat.color = '0x' + Math.floor(Math.random()*256).toString(16) + Math.floor(Math.random()*256).toString(16) + Math.floor(Math.random()*256).toString(16);
			animateFormat.size = size;
			animateFormat.align = 'center';
			animateText.defaultTextFormat = animateFormat;
			animateText.text = char;
			animateText.width = size+5;
			animateText.height = animateText.textHeight;
			animateText[pos == 'x'? 'x':'y'] = 300;
			animateText[pos == 'x'? 'y':'x'] = vertical;
			addChild(animateText);
			
			return animateText;
		}
		
		private function onecMore():void
		{
			var moreButton:TextField = new TextField();
			//moreButton.buttonMode = true;
			var format:TextFormat = new TextFormat();
			moreButton.x = 330;
			moreButton.y = 10;
			format.align = 'center';
			moreButton.height = 20;
			moreButton.width = 100;
			moreButton.antiAliasType = 'advanced';
			moreButton.border = false;
			moreButton.defaultTextFormat = format;
			moreButton.htmlText = "<a href='event:#'>Once More?</a>"

			addChild(moreButton);
			moreButton.addEventListener(TextEvent.LINK,reset);
			function reset():void
			{
				removeChild(moreButton);
				removeChild(timeTextField);
				//clearInterval()
				init();
				Time();
				//timeTextField.text = Timeout();
				stage.addEventListener(KeyboardEvent.KEY_DOWN,inputHandler);
			}
		}
	}
}