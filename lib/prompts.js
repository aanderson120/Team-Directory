const inquirer = require("inquirer")
const app = require("../server")
const queries = require("./queries")


function askQuestions() {
    inquirer.prompt([
        {
        type: "list",
        name: "direction",
        message: "What would you like to do?",
        choices: ["Update Departments", "Update Employee Roles", "Update Employee Information"]
        },
    ]).then(chooseInfo => {
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
    });

    //-------------------------------------- Dept --------------------------------------//

    function changeDept() {//view/delete department
    inquirer.prompt([
        {
        type: "list",
        name: "deptThings",
        message: "What would you like to do?",
        choices: ["View a department", "Add a department", "Delete a department", "Go back"]
        },
    ]).then(chooseInfo => {
        switch(chooseInfo.direction) {
            case "View a department":
                viewDept();
                break;
            case "Add a department":
                addDept();
                break;                
            case "Delete a department":
                deleteDept();
                break;  
            case "Go back":
                askQuestions();     
                break;                      
        }
    });
        viewDept = (connection) => {
            getDept(connection).then((res) => {
                const displayRes = res.map((row) => {
                    return {
                        Department: row.department,
                        Headcount: row.headcount,
                        "Labor Costs": row.labor_costs
                    }
                });
                console.table(displayRes);
            }).then (() => {
                showMenu(connection);
            });
        };
        // viewDept() {
        //     return this.connection.query("SELECT department.id, department.name, SUM(role.salary) AS utilized_budget FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id GROUP BY department.id, department.name;");
        //   };

        addDept = (connection) => {
            return inquirer.prompt(
            {
                type: "input",
                name: "newDept",
                message: "What is the name of the new department?",
                validate: (input) => validateRequired(input)
            }
            ).then((answer) => {
                insertDepartment(connection, answer.department);
            }).then (() => {
                showMenu(connection);
            });
        }

        //   addDept (department) {
        //     return this.connection.query ("INSERT INTO department SET ?", department);
        // };

        deleteDept = (departmentId) => {
            const promptDept = "Which department would you like to delete?";
            promptForDepartment(connection, promptDept).then ((departmentId) => {
                deleteById(connection, 'department', departmentId);
            }).then(() => {
                showMenu(connection);
            });
        };

        //   deleteDept(departmentId) {
        //     return this.connection.query("DELETE FROM department WHERE id = ?", departmentId);
        //   }
    }

        //-------------------------------------- Roles --------------------------------------//

    function changeRoles() {//view/add/delete roles
        inquirer.prompt([
            {
            type: "list",
            name: "roleThings",
            message: "What would you like to do?",
            choices: ["View a role", "Add a role", "Delete a role", "Update a role", "Go back"]
            },
        ]).then(chooseInfo => {
            switch(chooseInfo.direction) {
                case "View a department":
                    viewRole();
                    break;
                case "Add a department":
                    addRole();
                    break;                
                case "Delete a department":
                    deleteRole();
                    break;
                case "Update a role":
                    updateRole();     
                    break;    
                case "Go back":
                    askQuestions();     
                    break;                      
            }
        });
            viewRole = (connection) => {
                getRole(connection).then((res) => {
                    const displayRes = res.map((row) => {
                        return {
                            Department: row.role,
                            Headcount: row.department,
                            Salary: row.salary
                        }
                    });
                    console.table(displayRes);
                }).then (() => {
                    showMenu(connection);
                });
            };
            // viewRoles() {
            //     return this.connection.query("SELECT role.id, role.title, department.name AS department, role.salary FROM role LEFT JOIN department on role.department_id = department.id;");
            //   }
    
            addRole = (connection) => {
                const promptRole = "For which department do you wish to create the role?";
                promptForDepartment(connection,promptRole).then((departmentId) => {
                    let newRole = {department_id: departmentId};
                    inquirer.prompt([
                        {
                            type: "input",
                            name: "newRole",
                            message: "What is the name of the new role?",
                            validate: (input) => validateRequired(input)
                        },
                        {
                            type: "input",
                            name: 'salary',
                            validate: (input) => validateNumber(input)
                        }
                    ]).then((answer) => {
                            newRole.title = answer.title;
                            newRole.salary = answer.salary;

                            insertNewRole(connection, newRole);
                        }).then (() => showMenu(connection));
                });
            };
    
            // addRole(role) {
            //     return this.connection.query("INSERT INTO role SET ?", role);
            //   }
    
            deleteRole = (connection) => {
                const deptRole = "In which department would you like to delete the role from?";
                const roleDelete = "Which role would you like to delete?";
                promptForrole(connection, deptRole, roleDelete).then ((roleId) => {
                    deleteById(connection, 'role', roleId);
                }).then(() => {
                    showMenu(connection);
                });
            };
    
            // deleteRole(roleId) {
            //     return this.connection.query("DELETE FROM role WHERE id = ?", roleId);
            //   }

            updateRole = (connection) => {
                empRole(connection).then((employeeId) => {
                    let employeeInfo = {employee_id: employeeId};

                    const emplDept = "What is the employee's new department?";
                    const emplRole = "What is the employee's new role";
                    
                    promptRole(connection, emplDept, emplRole).then((roleId) => {
                        employeeInfo.role_id = roleId;
                        updateEmployee(connection, employeeInfo);
                    }).then(() => showMenu(connection));
                });
            };
    }

        //-------------------------------------- Employee --------------------------------------//

        function changeEmpl() {//view/add/delete employees
            inquirer.prompt([
                {
                type: "list",
                name: "emplThings",
                message: "What would you like to do?",
                choices: ["View an employee", "Add an employee", "Delete an employee", "Go back"]
                },
            ]).then(chooseInfo => {
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
            });
                viewEmpl = (connection) => {
                    getEmpl(connection).then((res) => {
                        const displayRes = res.map((row) => {
                            return {
                                Department: row.employee,
                                Headcount: row.headcount,
                                "Labor Costs": row.labor_costs
                            }
                        });
                        console.table(displayRes);
                    }).then (() => {
                        showMenu(connection);
                    });
                };
                // viewEmpl() {
                //     return this.connection.query(
                //       "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id;"
                //     );
                //   }
        
                addEmpl = (connection) => {
                    return inquirer.prompt(
                    {
                        type: "input",
                        name: "newRole",
                        message: "What is the name of the new role?",
                        validate: (input) => validateRequired(input)
                    }
                    ).then((answer) => {
                        insertRole(connection, answer.role);
                    }).then (() => {
                        showMenu(connection);
                    });
                }
        
                // addEmpl(employee) {
                //     return this.connection.query("INSERT INTO employee SET ?", employee);
                //   }
        
                deleteEmpl = (emplId) => {
                    const promptEmpl = "Which employee would you like to delete?";
                    promptForEmployee(connection, promptEmpl).then ((emplId) => {
                        deleteById(connection, 'department', emplId);
                    }).then(() => {
                        showMenu(connection);
                    });
                };
        
                // removeEmployee(employeeId) {
                //     return this.connection.query(
                //       "DELETE FROM employee WHERE id = ?",
                //       employeeId
                //     );
                //   }
            }
    
  }


// * View  employees


// Bonus points if you're able to:

// * Update employee managers

// * View employees by manager

// and employees

// * View the total utilized budget of a department -- ie the combined salaries of all employees in that department