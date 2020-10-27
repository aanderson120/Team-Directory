drop database if exists team_db;
create database team_db;

use team_db; 

create table department (
id integer unsigned auto_increment primary key,
name varchar(30) unique not null
);

create table role (
id integer unsigned auto_increment,
title varchar(30) not null,
salary integer not null,
department_id integer unsigned not null,
primary key (id)
-- constraint fk_dept foreign key (department_id) references department(id) on delete cascade
);

create table employee (
id int unsigned auto_increment primary key,
first_name varchar (30) not null,
last_name varchar (30) not null,
role_id integer unsigned not null,
-- index role_index (role_id),
-- constraint fk_role foreign key (role_id) references role (id) on delete cascade,
manager_id integer unsigned
-- index mgr_index(manager_id),
-- constraint fk_mgr foreign key (manager_id) references employee (id) on delete set null
); 
