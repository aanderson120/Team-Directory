"use strict";

const app = require("../server")
const queries = require("./queries")

const departChoice = [];
const deptId = [];
const roleChoice = [];
const roleID = [];
const emplChoice = [];
const emplId = [];

function askPrompts() {
    update(getDB);
}

function update(bits) {
    bits("role", "title");
    bits("department", "name");
    bits("employee", "full_name");
    bits("employee", "id");
    bits("department", "id");
    bits("role", "id");
}

function fillArray (arr, table, col, res) {
    arr.length = 0;
    for (table of res) {
        arr.push(table[col]);
    }

    if (arr === emplId || arr === deptId || arr === roleID) {
        arr.sort((a, b) => a-b);
    }
}

function getDB(table, column) {
    let choiceArr;
  
    switch (table) {
    case "department":
      choiceArr = departChoice;
      break;
    case "role":
      choiceArr = roleChoice;
      break;
    case "employee":
      choiceArr = emplChoice;
      break;
    default:
      throw new Error("Unknown choice");
    }

    if (table === "employee" && column === "full_name") {
        app.connection.query(queries.employeesFullName, (err, res) => {
            if (err) {throw err; }
            fillArray(choiceArr, table, column, res);
            console.log("you are here")
        });
    } else {
        app.connection.query(`SELECT ${column} FROM ${table}`, (err, res) => {
          if (err) { throw err; }
    
          switch (column) {
          case "name":
            fillArr(choiceArr, table, column, res);
            break;
          case "title":
            fillArr(choiceArr, table, column, res);
            break;
          case "id":
            if (table === "employee") {
              fillArr(employeeIds, "ids", column, res);
            } else if (table === "department") {
              fillArr(departmentIds, "ids", column, res);
            } else if (table === "role") {
              fillArr(roleIds, "ids", column, res);
            }
            break;
          default:
            throw new Error("Unknown column");
          }
        });
      }
    }

const askQuestions = {
    ask: {
        type: "list",
        name: "direction",
        message: "What would you like to do?",
        choices: ["Update Departments", "Update Employee Roles", "Update Employee Information", "Exit"]        
    },

    //--------------- department---------------//
    changeDept: {
        type: "list",
        name: "deptThings",
        message: "What would you like to do?",
        choices: ["View a department", "Add a department", "Delete a department", "Go back", "Exit"]        
    },
        viewDept: {
        type: "list",
        name: "viewDepartment",
        message: "Which department would you like to view?",
        choices: departChoice
        },
        addDept: {
        type: "input",
        name: "newDept",
        message: "What is the name of the new department?",
        },
        deleteDept: {
        type: "list",
        name: "deleteDepartment",
        message: "Which department would you like to delete?",
        choices: departChoice
        },

    //--------------- roles---------------//
    changeRoles: {
        type: "list",
        name: "roleThings",
        message: "What would you like to do?",
        choices: ["View a role", "Add a role", "Delete a role", "Go back", "Exit"]    
    },
        viewRole: {
        type: "list",
        name: "RoleDepartment",
        message: "Which role would you like to view?",
        choices: roleChoice
        },
        addRole: [
            {
            type: "input",
            name: "newRole",
            message: "What is the name of the new role?"
            },
            {
            type: "input",
            name: "salary",
            message: "What is the salary for this role?"
            },
            {
            type: "list",
            name: "roleDept",
            message: "Which department is this role in?",
            choices: departChoice
            }
        ],
        deleteRole: {
            type: "list",
            name: "deleteRole",
            message: "Which role would you like to delete?",
            choices: departChoice
        },

    //--------------- employee---------------//
    changeEmpl: {
        type: "list",
        name: "emplThings",
        message: "What would you like to do?",
        choices: ["View an employee", "Add an employee", "Delete an employee", "Go back", "Exit"]
    },
        viewEmpl: {
            type: "list",
            name: "viewEmployee",
            message: "Which employee would you like to view?",
            choices: emplChoice
        },
        addEmpl: [
            {
            type: "input",
            name: "firstName",
            message: "What is the employee's first name?"
            },
            {
            type: "input",
            name: "lastName",
            message: "What is the employee's last name?"
            },
            {
            type: "list",
            name: "emplRole",
            message: "What is the employee's role",
            choices: roleChoice
            },
            {
            type: "list",
            name: "emplMgr",
            message: "Who is the employee's manager?",
            choices: emplChoice
            }            
        ],
        deleteEmpl: {
            type: "list",
            name: "deleteEmpl",
            message: "Which employee would you like to delete?",
            choices: emplChoice
        },      
};

module.exports = {
    askQuestions,
    askPrompts,
    departChoice,
    deptId,
    roleChoice,
    roleID,
    emplChoice,
    emplId,
};