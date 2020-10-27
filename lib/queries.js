"use strict";

const allEmployees = "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id";

const allDepartments = "SELECT department.id, department.name, SUM(role.salary) AS utilized_budget FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id GROUP BY department.id, department.name";

const allRoles = "SELECT role.id, role.title, department.name AS department, role.salary FROM role LEFT JOIN department on role.department_id = department.id";

const addEmployee = "INSERT INTO employee SET first_name = ?, last_name = ?, role_id = ?, manager_id = ?";

const addDepartment = "INSERT INTO department SET d_name = ?";

const addRole = "INSERT INTO role SET title = ?, salary = ?, department_id = ?";

const updateEmployee = "UPDATE employee SET role_id = ? WHERE id = ?";

const employeesFullName = "SELECT concat(first_name, ' ', last_name) AS full_name FROM employee";

const employeesDepartment = "SELECT employee.id, employee.first_name, employee.last_name, department.d_name FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department department on role.department_id = department.id WHERE department.id;";

const employeesManager ="SELECT employee.id, employee.first_name, employee.last_name, department.d_name, employee.manager_id AS department, role.title FROM employee LEFT JOIN role on role.id = employee.role_id LEFT JOIN department ON department.id = role.department_id WHERE manager_id;";

const removeEmployee = "DELETE FROM employee WHERE id = ?";

const removeDepartment = "DELETE FROM department WHERE ?";

const removeRole = "DELETE FROM role WHERE ?";

module.exports = {
  allEmployees,
  allDepartments,
  allRoles,
  addEmployee,
  addDepartment,
  addRole,
  updateEmployee,
  employeesFullName,
  employeesDepartment,
  employeesManager,
  removeEmployee,
  removeDepartment,
  removeRole
};
