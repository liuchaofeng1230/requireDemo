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
