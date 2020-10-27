"use strict";

const { prompt } = require ("inquirer");
const table = require("console.table");
const {
    departChoice,
    deptId,
    roleChoice,
    roleID,
    emplChoice,
    emplId,
    askPrompts,    
} = require ("./prompts");
const queries = require ("./queries");
const app = require ("../server")

function initApp(){
    askPrompts();

    prompt(askPrompts.ask).then(answer => {
        switch (answer.direction) {
            case "Update Departments":
                prompt(askPrompts.deptThings).then(answer => {
                    switch (answer.changeDept) {
                        case "View a department":
                            view("department");
                            break;
                        case "Add a department":
                            add("department");
                            break;
                        case "Delete a department":
                            remove("department");
                            break;
                        case "Go back":
                            initApp();
                            break;
                        default:
                            app.connection.end();
                    }
                });
                break;
            case "Update Employee Roles":
                prompt(askPrompts.roleThings).then(answer => {
                    switch (answer.changeRoles) {
                        case "View a role":
                            view("role");
                            break;
                        case "Add a role":
                            add("role");
                            break;
                        case "Delete a role":
                            remove("role");
                            break;
                        case "Go back":
                            initApp();
                            break;
                        default:
                            app.connection.end();                        
                    }
                });
                break;
            case "Update Employee Information":
                prompt(askPrompts.emplThings).then(answer => {
                    switch (answer.changeEmpl) {
                        case "View an employee":
                            view("employee");
                            break;
                        case "Add an employee":
                            add("employee");
                            break;
                        case "Delete an employee":
                            remove("employee");
                            break;
                        case "Go back":
                            initApp();
                            break;
                        default:
                            app.connection.end();           
                    }
                });
                break;
            default:
                app.connection.end();
        }
    });
}

function view(choice) {
    switch(choice) {
        case "department":
            getQuery("view", queries.allDepartments);
            break;
        case "role":
            getQuery("view", queries.allRoles);
            break;     
        case "employee":
            getQuery("view", queries.allEmployees);
            break;
        default:
            throw Error("Error finding your selection");   
    }
}

function add(choice) {
    switch (choice) {
        case "department":
            prompt(prompts.addDept).then(answer => {
                getQuery("add", queries.addDept, {name: answer.departmentName});
            });
            break;
        case "role":
            prompt(prompts.addRole).then(answer => {
                const deptIdIndex = departChoice.indexOf(
                    answer.roleDept
                );
                const deptId = deptId[deptIdIndex];

                getQuery("add", queries.addRole, {title: answer.roleName, salary: answer.salary, department_id:deptId});

            });
            break;
        case "employee":
            employeeChoices.push("null");
            
            prompt(askPrompts.addEmpl).then(answer => {
                const roleID = roleChoice.indexOf(answer.emplRole) +1;
                const mgrIdIndex = emplChoice.indexOf(answer.emplMgr);
                const mgrID = emplId[mgrIdIndex];

                getQuery("add", queries.addEmpl, {first_name: answer.firstName,last_name: answer.lastName,role_id: roleID,manager_id: mgrID});                    
            });
            break;
            default:
                throw Error("Error finding your selection");
    }
}

function remove(choice) { 
    switch(choice) {
        case "department":
            prompt(askPrompts.deleteDept).then(answer => {
                getQuery("delete", queries.deleteDept, {name: answer.deleteDept});
            });
            break;
        case "role":
            prompt(askPrompts.deleteRole).then(answer => {
                getQuery("remove", queries.deleteRole, {title: answer.deleteRole});
            });
            break;
        case "employee":
            prompt(askPrompts.deleteEmpl).then(answer => {
                const emplIdIndex = employeeChoices.indexOf(answer.deleteEmpl);
                const employeeId = emplId[emplIdIndex];
                getQuery("remove", queries.deleteEmpl, {id:employeeId});
            });
        break;
        default:
            throw Error("Error finding your selection");
 }
}

function getQuery(choice, type, setting) {
    app.connection.query(type, setting, (err, res) => {
      if (err) { throw err; }
      const createTable = table.getTable(res);
  
      if (choice === `view`) {
        if (res.length === 0) {
          console.log(`\nNo data! \nMay not be a manager. \nMay not have employees in the department yet.`);
        }
        console.log(`\n${createTable}`);
        initApp();
      } else {
        initApp();
      }
    });
  }
  
  module.exports = {
    initApp
  };
  