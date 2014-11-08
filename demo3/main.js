// require(['table'], function(table){
// });

var G = {};

G.Employee = function(name) {
    this.name = name;
    this.company = new G.Company(name + "'s own company");
};

G.Company = function(name) {
    this.name = name;
    this.employees = [];
};
G.Company.prototype.addEmployee = function(name) {
    var employee = new G.Employee(name);
    this.employees.push(employee);
    employee.company = this;
};
G.Company.prototype.showEmployee = function(){
    var names = this.employees.map(function(employee){
        return employee.name;
    });
    console.log(names);
};

G.main = function(){
    var john = new G.Employee("John");
    var bigCorp = new G.Company("Big Corp");
    bigCorp.addEmployee("Mary");
    bigCorp.showEmployee();
};

G.main();
