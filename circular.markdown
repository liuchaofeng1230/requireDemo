# 关于前端模块循环依赖问题的一些思考

## 1. 什么是前段模块循环依赖问题
模块间的依赖分为静态依赖和动态依赖，动态依赖如demo1所示：

```
// module a
define('a', ['b'], function(b){
	b.func();
	return {
		call: function(){
			// do something
		}
	};
}); 

// module b
define('b', ['a'], function(a){
	return {
		func: function(){
			a.call();
		}
	};
});

```
尽管模块间循环依赖了，但是不会对代码运行造成影响，因为在初始化时，模块a和b都能正常地返回的对象。

而静态依赖则如demo2所示：

```
// module a
define('a', ['b'], function(b){
	b.func();
	return {
		call: function(){
			// do something
		}
	};
}); 

// module b
define('b', ['a'], function(a){
	a.call();
});
```

因为2个模块在初始化时候即调用了对方，其中之一必然不能正确地返回对象，导致代码报错。

我们需要解决的主要是静态循环依赖问题。

## 2. 前端模块循环依赖问题的解决方案

我们来看一个具体的例子：

```
define("Employee", ["Company"], function(Company) {
    return function (name) {
        this.name = name;
        this.company = new Company(name + "'s own company");
    };
});

define("Company", ["Employee"], function(Employee) {
    function Company(name) {
        this.name = name;
        this.employees = [];
    }
    Company.prototype.addEmployee = function(name) {
        var employee = new Employee(name);
        this.employees.push(employee);
        employee.company = this;
    };
    return Company;
});

define("main", ["Employee", "Company"], function (Employee, Company) {
    var john = new Employee("John");
    var bigCorp = new Company("Big Corp");
    bigCorp.addEmployee("Mary");
});

```
因为在初始化时候，需要注册一个员工和一家公司，同时把这个员工添加到这家公司中去，而员工的属性里又要记录他所在的公司，所以同时调用了2个互相依赖的模块的方法，产生了静态循环依赖问题，导致代码报错。

有以下几种方法解决循环依赖

### 1. require



