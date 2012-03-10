//Constructor
var Interface = function(name,methods){
	if(arguments.length!=2){
		throw new Error('Interface constructor called with' + arguments.length + 'arguments, but expected exactly 2.');
	}
	this.name = name;
	this.methods = [];
	for(var i = 0, len = methods.length; i < len; i++){
		if(typeof methods[i] !== 'string'){
			throw new Error('Interface constructor expects method names to be' + 'passed in as a string.');
		}
		this.methods.push(methods[i]);
	}
}

//Static class method
Interface.ensureImplements = function(object){
	if(arguments.length<2){
		throw new Error('Interface constructor called with' + arguments.length + 'arguments, but expected at least 2.');
	}
	for(var i = 1, len = arguments.length; i < len; i++){
		var interface = arguments[i];
		if(interface.constructor !== Interface){
			throw new Error('Function Interface.ensureImplements expects arguments' + 'two an above to be instance of Interface');
		}
		for(var j = 0, methodLen = interface.methods.length; j < methodLen; j++){
			var method = interface.methods[j];
			if(!object[method] || typeof object[method] !=='function'){
				throw new Error('Function Interface.ensureImplements: '+ object + ' does not implement the ' + interface.name + 'interface. Method ' + method + ' was not found.');
			}
		}
		
	}
}

/*
 * extend():使子类继承超类类
 * superClass:表示超类
 * subClass:表示子类
 */
function extend(subClass,superClass){
	var F = function(){};
	F.prototype = superClass.prototype;//new superClass();//
	subClass.prototype = new F();
	subClass.prototype.constructor = subClass;

	//在子类中提供一个到超类的引用，这样就可以使用超类而不是超类原型中的属性或方法。
	subClass.superClass = superClass;
	if(superClass.prototype.constructor == Object.prototype.constructor){
		superClass.prototype.constructor = superClass;
	}
}


var Bicycle = new Interface('Bicycle',['assemble','wash','ride','repair']);
var Speedster = function(){

}
Speedster.prototype = {
	constructor:Speedster,
	assemble:function(){
		console.log('The Speedster Bicycle has been assembled!');
	},
	wash:function(){
		console.log('The Speedster Bicycle has been washed!');
	},
	ride:function(){

	},
	repair:function(){

	}
}

var AcmeSpeedster = function(){
	Speedster.call(this,arguments);
}
extend(AcmeSpeedster,Speedster);

var GeneralSpeedster = function(){
	Speedster.call(this,arguments);
}
extend(GeneralSpeedster,Speedster);


var Lowride = function(){

}
Lowride.prototype = {
	constructor:Lowride,
	assemble:function(){
		console.log('The Lowride Bicycle has been assembled!');
	},
	wash:function(){
		console.log('The Lowride Bicycle has been washed!');
	},
	ride:function(){

	},
	repair:function(){

	}
}

var AcmeLowride = function(){
	Lowride.call(this,arguments);
}
extend(AcmeLowride,Lowride);

var GeneralLowride = function(){
	Lowride.call(this,arguments);
}
extend(GeneralLowride,Lowride);

var ComfortCruiser = function(){

}
ComfortCruiser.prototype = {
	constructor:ComfortCruiser,
	assemble:function(){
		console.log('The ComfortCruiser Bicycle has been assembled!');
	},
	wash:function(){
		console.log('The ComfortCruiser Bicycle has been washed!');
	},
	ride:function(){

	},
	repair:function(){

	}
}

var AcmeComfortCruiser = function(){
	ComfortCruiser.call.apply(this,arguments);
}
extend(AcmeComfortCruiser,ComfortCruiser);

var GeneralComfortCruiser = function(){
	ComfortCruiser.call.apply(this,arguments);
}
extend(GeneralComfortCruiser,ComfortCruiser);

var BicycleFactory = function(){
	this.model = arguments[0]; //arguments[1]表示model
}
BicycleFactory.prototype = {
	constructor:BicycleFactory,
	createBicycle:function(){
		var bicycle;
		switch(this.model){
			case 'The Speedster':
				bicycle = new Speedster();
				break;
			case  'The Lowride':
				bicycle = new Lowride();
				break;
			default:
				bicycle = new ComfortCruiser();
		}
		Interface.ensureImplements(bicycle,Bicycle);
		return bicycle;
	}
}

var AcmeBicycleFactory = function(){
	BicycleFactory.apply(this,arguments); //继承超类的属性或方法（非原型）
}
extend(AcmeBicycleFactory,BicycleFactory);
AcmeBicycleFactory.prototype.createBicycle = function(){
	var bicycle;
	switch(this.model){
		case 'The Speedster':
			bicycle = new AcmeSpeedster();
			break;
		case  'The Lowride':
			bicycle = new AcmeLowride();
			break;
		default:
			bicycle = new AcmeComfortCruiser();
	}
	Interface.ensureImplements(bicycle,Bicycle);
	return bicycle;
}

var GeneralBicycleFactory = function(){
	BicycleFactory.apply(this,arguments); //继承超类的属性或方法（非原型）
}
extend(GeneralBicycleFactory,BicycleFactory);
GeneralBicycleFactory.prototype.createBicycle = function(model){
	var bicycle;
	switch(this.model){
		case 'The Speedster':
			bicycle = new GeneralSpeedster();
			break;
		case  'The Lowride':
			bicycle = new GeneralLowride();
			break;
		default:
			bicycle = new GeneralComfortCruiser();
	}
	Interface.ensureImplements(bicycle,Bicycle);
	return bicycle;
}

var BicycleShop = function(){}
BicycleShop.prototype = {
	constructor:BicycleShop,
	sellBicycle:function(factory){
		//var bicycle = arguments[0];
		var bicycle = factory.createBicycle();
		bicycle.assemble();
		bicycle.wash();
		//return factory;
	}
}