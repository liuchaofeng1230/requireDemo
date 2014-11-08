// require(['table'], function(table){
//     table.load();
// });

define("Employee", ["Company"], function(Company) {
    return function (name) {
        this.name = name;
        this.company = new Company(name + "'s own company");
    };
});
define("Company", ["require"], function(require) {
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
