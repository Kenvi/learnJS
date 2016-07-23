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


/*
* 单体模式
* 实现一个跨浏览器的事件处理程序
*/
CP.EventUtil = {
	addHandler : function(element,type,handler){
		if(element.addEventListener){ // Firefox Chrome
			element.addEventListener(type,handler,false);
		}else if(element.attachEvent){ // IE
			element.attachEvent('on'+type,handler);
		}
	},
	removeHandler : function(element,type,handler){
		if(element.removeEventListener){ // Firefox Chrome
			element.removeEventListener(type,handler,false);
		}else if(element.detachEvent){ // IE
			element.detachEvent('on'+type,handler);
		}
	}
};


/*
* 扩展Arry的原型对象，添加变量数组的每一个函数，并让每个元素执行fn函数
* 手动实现array each方法 能遍历多维数组
*/
Array.prototype.each  = function(fn){
	try{

		this.i || (this.i=0);//计数器 记录当前遍历的元素位置

		if(this.length>0 && fn.constructor == Function){ //数组长度不能为零且参数必须为函数
			while(this.i < this.length){
				var e = this[this.i];
				if(e && e.constructor == Array){ // 已获取当前元素且当前元素为数组
					e.each(fn); // 继续递归操作
				}else{
					fn.call(e,e); // 当前元素不为数组 将其作为参数传递给fn函数回调
				}
				this.i++;
			}
			this.i = null; // 释放内存 垃圾回收
		}

	}catch(err){
		console.log(err);
	}
	
	return this;

};