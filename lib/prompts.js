const inquirer = require("inquirer")
const app = require("../server")
const queries = require("./queries")

const departChoice = [];
const deptId = [];
const roleChoice = [];
const roleID = [];
const emplChoice = [];
const emplId = [];



function initPrompts() {
    updateInfo(getDB)
}

function fillArr (arr, table, col, res) {
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
        case `department`:
            choiceArr = departChoice;
            break;
        case `role`:
            choiceArr = roleChoice;
            break;
        case `employee`:
            choiceArr = emplChoice;
            break;
        default:
            throw new Error (`Uknown`);
    }

    if (table === `employe` && column === `full_name`) {
        app.connection.query(queries.employeesFullName, (err, res) => {
            if (err) {throw err; }
            fillArr(choiceArr, table, column, res);
        });
    } else {
        app.connection.query(`select ${column} from ${table}`, (err, res) => {
            if (err) {throw err; }

            switch (column) {
                case `name`:
                    fillArr(choiceArr, table, column, res);
                    break;
                case `title`:
                    fillArr(choiceArr, table, column, res);
                    break;
                case `id`:
                    if (table === `employee`) {
                        fillArr(emplId, `ids`, column, res);
                    } else if (table === `department`) {
                        fillArr(deptId, `ids`, column, res);
                    }else if (table === `role`) {
                        fillArr(roleID, `ids`, column, res);
                    }
                    break;
                default:
                    throw new Error (`Unkown`);
            }
        });
    }
}

function update(bits) {
    bits(`role`, `title`);
    bits(`department`, `name`);
    bits(`employee`, `full_name`);
    bits(`employee`, `id`);
    bits(`department`, `id`);
    bits(`role`, `id`);
}

const askQuestions = {
    ask: {
        type: "list",
        name: "direction",
        message: "What would you like to do?",
        choices: ["Update Departments", "Update Employee Roles", "Update Employee Information"]        
    }.then(chooseInfo => {
        switch(chooseInfo.direction) {
            case "Update Departments":
                changeDept();
                break;
            case "Update Employee Roles":
                changeRoles();
                break;                
            case "Update Employee Information":
                changeEmpl();
                break;
            default:
                askQuestions();                           
        }
    }),

    //--------------- department---------------//
    changeDept: {
        type: "list",
        name: "deptThings",
        message: "What would you like to do?",
        choices: ["View a department", "Add a department", "Delete a department", "Go back", "Exit"]        
    }.then(chooseInfo => {
        switch(chooseInfo.deptThings) {
            case "View a department":
                changeDept();
                break;
            case "Add a department":
                addDept();
                break;                
            case "Delete a department":
                changeEmpl();
                break;
            case "Go back":
                askQuestions();
                break;                         
        }
    }),
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
    }.then(chooseInfo => {
        switch(chooseInfo.roleThings) {
            case "View a role":
                viewRole();
                break;
            case "Add a role":
                addRole();
                break;                
            case "Delete a role":
                deleteRole();
                break;
            case "Go back":
                askQuestions();     
                break;                      
        }
    }),
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
    }.then(chooseInfo => {
        switch(chooseInfo.direction) {
            case "View an employee":
                viewEmpl();
                break;
            case "Add an employe":
                addEmpl();
                break;                
            case "Delete an employee":
                deleteEmpl();
                break;  
            case "Go back":
                askQuestions();     
                break;                      
            }
        }),
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
    propts,
    initPrompts,
    departChoice,
    deptId,
    roleChoice,
    roleID,
    emplChoice,
    emplId,
};