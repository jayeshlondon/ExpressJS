var mongoose = require('mongoose');

var employeeSchema = new mongoose.Schema({
    name: String,
    email: String,
    etype: String,
    hourlyrate: Number,
    totalHour: Number
  });
  employeeSchema.methods.totalSalary = function(){
        console.log("Total income of %s: £%d", this.name, this.hourlyrate * this.totalHour);
    };
var employeeModel = mongoose.model('Employee', employeeSchema);

var employees = new employeeModel({ name: 'Akshar', 
                                    email: 'akshar@gmail.com',
                                    etype: 'hourly',
                                    hourlyrate: 10,
                                    totalHour: 9
                                    });
                                    console.log(employees);
employees.totalSalary();
