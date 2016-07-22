/*
*
* CP 命名空间 
*/
var CP = {};

/*
*
* Class Interface 
*/
// 接口类 实例化N多个接口
CP.Interface = function(name,methods){
	// 判断接口的参数个数
	if(arguments.length !== 2){
		throw new Error("This instance interface constructor arguments must be two!");
	}

	this.name = name;
	this.methods = [];
	for(var i=0;i<methods.length;i++){
		if(typeof methods[i] !== 'string'){
			throw new Error("The interface method's name must be string!");  
		}
		this.methods.push(methods[i]);
	}
}

/*
*
* Interface static method
*/
// 检验接口内方法
CP.Interface.ensureImplements = function(object){
	if(arguments.length<2){
		throw new Error("Interface.ensureImplements methods' constructor must >=2 !");
	}
	// 获得接口实例对象
	for(var i=1;i<arguments.length;i++){
		var instanceInterface = arguments[i];
		// 判断参数是否为接口类的类型
		if(instanceInterface.constructor !== CP.Interface){
			throw new Error("The argument's constructor is not belong to Interface Class!");					
		}

		// 循环接口对象里的每一个方法
		for(var j=0;j<instanceInterface.methods.length;j++){
			var methodName = instanceInterface.methods[j]; // method's name(临时变量接收每一个方法的名称，为字符串类型)
			if(!object[methodName] || typeof object[methodName] !== 'function'){
				throw new Error("The method '"+methodName+"' is not found!");			
			}
		}
	}
};


/*
*
* Extend
*/
// extend方法：只继承一次父类属性和方法和父类原型对象
CP.extend = function (sub,sup){
	var F = new Function(); //创建一个空函数进行中转
	
	F.prototype = sup.prototype; //实现空函数的原型对象和超类的原型对象转换
	sub.prototype = new F(); //原型继承
	sub.prototype.constructor = sub; // 还原子类构造器
	// 保存父类的原型对象：（1）方便解耦；（2）方便获得父类的原型对象
	sub.superClass = sup.prototype; // 子类自定义一个静态属性接受父类原型对象
	// 判断父类的原型对象的构造器
	if(sup.prototype.constructor === Object.prototype.constructor){
		sup.prototype.constructor = sup; 
	}
};