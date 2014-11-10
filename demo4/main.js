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
