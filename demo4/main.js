// require(['table'], function(table){
// });

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
