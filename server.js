const util = require("util");
const mysql = require("mysql");
const { prompt } = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "team_db"
  });

  connection.connect((err) => {
    if (err) {
        console.log(err);
        res.status(500);
        return res.send("There was an error connecting to the database.");
    } console.log("You're connected!");

})

  connection.query = util.promisify(connection.query);

  askQuestions();
  
  //--------------- prompts---------------//

async function askQuestions() {
  const { choice } = await prompt([
    {
      type: "list",
      name: "choice",
      message: "What would you like to do?",
      choices: [
          {
            name: "View a department",
            value:"departmentView"
           },
          {
            name: "Add a department",
            value: "deptNew"
           },
          {
            name: "Delete a department",
            value: "departmentDelete"
           },
          {
            name: "View a role",
            value:"departmentRole"
           },
          {
            name: "Add a role",
            value: "roleNew"
           },
          {
            name: "Delete a role",
            value: "roleDelete"
           },
          {
            name: "View an employee",
            value:"employeeView"
           },
          {
            name: "Add an employee",
            value: "emplNew"
           },
          {
            name: "Delete an employee",
            value: "emplDelete"
           },
           {
            name: "Exit",
            value: "yeet"
          }                   
      ]
    }
  ]);
  
  switch(choice) {
        case "departmentView":
          return viewDepartment();
        case "deptNew":
          return newDept();
        case "departmentDelete":
          return deleteDepartment();
        case "departmentRole":
          return viewRole();
        case "roleNew":
          return newRole();
        case "roleDelete":
          return deleteRole();
      case "employeeView":
          return viewEmployee();
      case "emplNew":
          return newEmpl();
      case "emplDelete":
          return deleteEmpl();        
      case  "yeet":
          quit();
          break;
      default:
          console.log("error")
  }

}

  //--------------- functions ---------------//

      //----- view -----//
async function viewDepartment() {
  const department = connection.query(`SELECT name AS Departments FROM department`);
   
  console.table(department);

  askQuestions();
      
}

async function viewRole() {
  let allRoles = await connection.query(`SELECT title AS Roles FROM role`);
  
  console.table(allRoles);

  askQuestions();
}

async function viewEmployee() {
  let allEmpl = await connection.query(`SELECT employee.id AS 'Employee ID', employee.first_name AS 'First Name', employee.last_name AS 'Last Name', role.title AS 'Title', department.name AS 'Department', role.salary AS 'Salary', concat(E.first_name, ' ', E.last_name) AS 'Manager Name' FROM employee INNER JOIN role ON (employee.role_id = role.id) INNER JOIN department ON (role.department_id = department.id) LEFT JOIN employee E ON (employee.manager_id = E.id) ORDER BY employee.id;`);

  console.table(allEmpl);

  askQuestions();
}

      //----- add -----//
async function newDept () {
  const deptNew = await prompt ([
    {
      name: "name",
      message: "What is the name of the new department?"
    }
  ]);

  await connection.query(`INSERT INTO department SET ?`);
  console.log(`${deptNew.name} added`);
  askQuestions();
}
 async function newRole() {
   let allDepartments = await connection.query(`SELECT name AS Departments FROM department`);

   const departmentChoice = allDepartments.map(({ id, name }) => ({
     name: name,
     value: id
   }));

   const roleNew = await prompt ([
     {
       name: "roleName",
       message: "What is the name of the new role?"
     },
     {
       name: "salary",
       message: "What is the salary for this role?"
     },
     {
       name: "deptRole",
       message: "Which department is this role in?",
       choice: departmentChoice
     }
   ]);

   await connection.query(`SELECT title AS Roles FROM role`);
   console.log(`${roleNew.name} added`);
   askQuestions();

   }

  async function newEmpl() {
    let allRoles = await connection.query(`SELECT title AS Roles FROM role`);
    let allEmpl = await connection.query(`SELECT employee.id AS 'Employee ID', employee.first_name AS 'First Name', employee.last_name AS 'Last Name', role.title AS 'Title', department.name AS 'Department', role.salary AS 'Salary', concat(E.first_name, ' ', E.last_name) AS 'Manager Name' FROM employee INNER JOIN role ON (employee.role_id = role.id) INNER JOIN department ON (role.department_id = department.id) LEFT JOIN employee E ON (employee.manager_id = E.id) ORDER BY employee.id;`);

    const emplNew = await prompt([
      {
        name:"firstName",
        message: "What is the employee's first name?"
      },
      {
        name: "lastName",
        message: "What is the employee's last name?"
      }
    ]);
    const roleChoice = allRoles.map(({ id, title}) => ({
      name: title,
      value: id
    }));
    const { roleId } = await prompt ({
      type: "list",
      name: "roleId",
      message: "What is the employee's role",
      choices: roleChoice
    });

    employee.role_id = roleId;
    const emplMgr = allEmpl.map (({ id, first_name, last_name}) => ({
      name: `${first_name} ${last_name}`,
      value: id
    }));
    emplMgr.unshift({name: "None", value: null });

    const {managerId} = await prompt ({
      type: "list",
      name: "managerId",
      message: "Who is the employee's manager?",
      choices: emplChoice
    });

    employee.manager_id = managerId;
    await connection.query(`SELECT employee.id AS 'Employee ID', employee.first_name AS 'First Name', employee.last_name AS 'Last Name', role.title AS 'Title', department.name AS 'Department', role.salary AS 'Salary', concat(E.first_name, ' ', E.last_name) AS 'Manager Name' FROM employee INNER JOIN role ON (employee.role_id = role.id) INNER JOIN department ON (role.department_id = department.id) LEFT JOIN employee E ON (employee.manager_id = E.id) ORDER BY employee.id;`)(emplNew);
    console.log(`${emplMgr.first_name} ${emplMgr.last} added`);
    askQuestions();

    }

          //----- delete -----//
async function deleteDepartment () {
  let allDepartments = await connection.query(`SELECT name AS Departments FROM department`);

  const departChoice = allDepartments.map(({ id, name }) => ({
    name: name,
    value: id
  }));

  const { departmenttId } = await prompt ({
    type: "list",
    name: "deleteDepartments",
    message: "Which department would you like to delete?",
    choices: departChoice
  });
  await connection.query(`DELETE FROM employee WHERE ?`)(departmenttId);
  console.log(`${departChoice.name} removed`);
  askQuestions();

}

async function deleteRole () {
  let allRoles = await connection.query(`SELECT title AS Roles FROM role`);
  let roleChoice = allRoles.map(({ id, title}) => ({
    name: title,
    value: id
  }));

  const { roleId } = await prompt([
    {
      type:"list",
      name: "deleteRoles",
      message: "Which role would you like to delete?",
      choices: roleChoice
    }
  ]);
  await connection.query(`DELETE FROM role WHERE ?`)(roleId);
  console.log(`${roleId.name} removed`);
  askQuestions();
}

async function deleteEmpl() {
  let allEmployees = await connection.query(`SELECT employee.id AS 'Employee ID', employee.first_name AS 'First Name', employee.last_name AS 'Last Name', role.title AS 'Title', department.name AS 'Department', role.salary AS 'Salary', concat(E.first_name, ' ', E.last_name) AS 'Manager Name' FROM employee INNER JOIN role ON (employee.role_id = role.id) INNER JOIN department ON (role.department_id = department.id) LEFT JOIN employee E ON (employee.manager_id = E.id) ORDER BY employee.id;`);

  const emplChoice = allEmployees.map(({ id, first_name, last_name}) => ({
    name: `${first_name} ${last_name}`,
    value: id
  }));

  const { employeeId } = await prompt ([
    {
      type: "list",
      name: "deleteEmpl",
      message: "Which employee would you like to delete?",
      choices: emplChoice
    }
  ]);
  await connection.query(`DELETE FROM employee WHERE ?`)(employeeId);
  console.log(`${employee.first_name} ${employee.last} removed`);
  askQuestions();
}

function quit() {
  process.exit();
  }
