package {
	import flash.display.Sprite;
	import flash.text.TextField;
	import flash.text.TextFieldType;
	import flash.text.TextFieldAutoSize;
	import flash.events.TextEvent;
	
	public class textInput extends Sprite {
		private var instructionTextField:TextField = new TextField();
		private var inputTextField:TextField = new TextField(); 
		private var warningTextField:TextField = new TextField();
		private var result:String = "";
		
		public function textInput() {
			instructionTextField.x = 10;
			instructionTextField.y = 10;
			instructionTextField.background = true; 
			instructionTextField.autoSize = TextFieldAutoSize.LEFT;
			instructionTextField.text = "Please enter a value in the format A#AA#AA,\n" 
				+ "where 'A' represents a letter and '#' represents a number.\n" +
				"(Note that once you input a character you can't change it.)" ;
			
			inputTextField.x = 10;
			inputTextField.y = 70;
			inputTextField.height = 20;
			inputTextField.width = 75;
			inputTextField.background = true;
			inputTextField.border = true;
			inputTextField.type = TextFieldType.INPUT; 
			
			warningTextField.x = 10;
			warningTextField.y = 100;
			warningTextField.autoSize = TextFieldAutoSize.LEFT;
			
			inputTextField.addEventListener(TextEvent.TEXT_INPUT, textInputHandler);   
			
			this.addChild(instructionTextField);
			this.addChild(inputTextField);
			this.addChild(warningTextField);
		}
		
		private function textInputHandler(event:TextEvent):void {
			var charExp:RegExp = /[a-zA-z]/;   
			var numExp:RegExp = /[0-9]/;
			
			event.preventDefault();  
			
			inputTextField.text = result;                
			inputTextField.setSelection(result.length + 1, result.length + 1);
			
			if (inputTextField.text.length == 1 || inputTextField.text.length == 4) {
				
				if(numExp.test(event.text) == true) {
					updateCombination(event.text);
				} else {
					warningTextField.text = "You need a single digit number.";
				}
				
			}else {
				
				if(charExp.test(event.text) == true) { 
					updateCombination(event.text);
				} else {
					warningTextField.text = "You need an alphabet character.";
				}
			}
			
			if(inputTextField.text.length == 7) {
				inputTextField.type = TextFieldType.DYNAMIC;
				instructionTextField.text = "CONGRATULATIONS. You've done.";                
			}          
		}
		
		private function updateCombination(s:String):void {
			warningTextField.text = "";
			result += s;           
			inputTextField.text = result;
			inputTextField.setSelection(result.length + 1, result.length + 1);
		}
	}
}
