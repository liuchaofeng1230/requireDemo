# 关于前端模块循环依赖问题的一些思考

## 1. 什么是前段模块循环依赖问题
模块间的依赖分为静态依赖和动态依赖，动态依赖如demo1所示：

```
// module a
define('a', ['b'], function(b){
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

require(["b"], function (b) {
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
    return {
        func: function(){
            a.call();
        }
    };
});

require(["b"], function (b) {
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

### 1. event(引入第三方模块)

```
define("event", function(){
    var events = {};
    return {
        trigger: function(evt){
            if(evt in events){
                return events[evt](Array.prototype.slice.call(arguments, 1)[0]);
            }
        },
        on: function(evt, callback){
            events[evt] = callback;
        }
    };
});

define("Employee", ["Company", "event"], function(Company, Event) {
    var Employee = function (name) {
        this.name = name;
        this.company = new Company(name + "'s own company");
    };
    Event.on('Employee:new', function(name){
        return new Employee(name);
    });
    return Employee;
});

define("Company", ["event"], function(Event) {
    function Company(name) {
        this.name = name;
        this.employees = [];
    }
    Company.prototype.addEmployee = function(name) {
        var employee = Event.trigger('Employee:new', name);
        this.employees.push(employee);
        employee.company = this;
    };
    Company.prototype.showEmployee = function(){
        var names = this.employees.map(function(employee){
            return employee.name;
        });
        console.log(names);
    };
    return Company;
});

define("main", ["Employee", "Company"], function (Employee, Company) {
    var john = new Employee("John");
    var bigCorp = new Company("Big Corp");
    bigCorp.addEmployee("Mary");
    bigCorp.showEmployee();
});
```
引入第三方的事件模块，将可能产生循环依赖的操作注册在事件模块中，从而避免了循环依赖。但是这种方法不容易从依赖列表中看出依赖关系。

### 2. require

```
define("Employee", ["Company"], function(Company) {
    return function Employee(name) {
        this.name = name;
        this.company = new Company(name + "'s own company");
    };
});

define("Company", ["require", "Employee"], function(require, Employee) {
    function Company(name) {
        this.name = name;
        this.employees = [];
    }
    Company.prototype.addEmployee = function(name) {
        var employee = new (require('Employee'))(name);
        this.employees.push(employee);
        employee.company = this;
    };
    Company.prototype.showEmployee = function(){
        var names = this.employees.map(function(employee){
            return employee.name;
        });
        console.log(names);
    };
    return Company;
});

define("main", ["Employee", "Company"], function (Employee, Company) {
    var john = new Employee("John");
    var bigCorp = new Company("Big Corp");
    bigCorp.addEmployee("Mary");
    bigCorp.showEmployee();
});
```

可以在console里看到，正确执行了代码。静态循环依赖的问题在于，因为循环依赖，所以初始化时候Company模块中获得的Employee模块其实是undefined，但通过require方法，在实际用到Emplyee模块时重新去获取了一遍，此时因为Employee模块已经被执行过有了具体的对象，静态循环依赖的问题演变成了动态的循环依赖，代码就能正常运行了。

### 3. exports

```
define("Employee", ["exports", "Company"], function(exports, Company) {
    function Employee(name) {
        this.name = name;
        this.company = new Company.Company(name + "'s own company");
    }
    exports.Employee = Employee;
});
define("Company", ["exports", "Employee"], function(exports, Employee) {
    function Company(name) {
        this.name = name;
        this.employees = [];
    }
    Company.prototype.addEmployee = function(name) {
        var employee = new Employee.Employee(name);
        this.employees.push(employee);
        employee.company = this;
    };
    Company.prototype.showEmployee = function(){
        var names = this.employees.map(function(employee){
            return employee.name;
        });
        console.log(names);
    };
    exports.Company = Company;
});

define("main", ["Employee", "Company"], function (Employee, Company) {
    var john = new Employee.Employee("John");
    var bigCorp = new Company.Company("Big Corp");
    bigCorp.addEmployee("Mary");
    bigCorp.showEmployee();
});
```

这种方法使用CommonJS的规范写法，将所有模块输出保存到全局中，类似于以下这种写法:

```
var G = {};

(function(){
     var Employee = function(name) {
        this.name = name;
        this.company = new G.Company(name + "'s own company");
    };
    G.Employee = Employee;
}());

(function(){
    var Company = function(name) {
        this.name = name;
        this.employees = [];
    };
    Company.prototype.addEmployee = function(name) {
        var employee = new G.Employee(name);
        this.employees.push(employee);
        employee.company = this;
    };
    Company.prototype.showEmployee = function(){
        var names = this.employees.map(function(employee){
            return employee.name;
        });
        console.log(names);
    };
    G.Company = Company;
}());

(function(){
    var john = new G.Employee("John");
    var bigCorp = new G.Company("Big Corp");
    bigCorp.addEmployee("Mary");
    bigCorp.showEmployee();
}());

```

## 3. 结论

比较三种方法：

1. event方法，或者其他引入第三方模块的方法，增加了复杂度，而且引入的第三方模块仅仅是为了解决循环依赖问题，无实际意义；
2. event和require方法，在依赖列表里可能反映不出真实的依赖情况；
3. require方法，如果在模块中多次用到循环依赖的模块，则需要多次调用局部require；

综上，遇到循环依赖问题时，建议使用exports方法
