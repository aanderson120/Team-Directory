drop database if exists team_db;
create database team_db;

use team team_db; 

create table department (
id integer unsigned auto_increment,
name varchar(30) not null,
primary key (id),
unique (name)
);

create table role (
id integer unsigned auto_increment,
title varchar(30) not null,
salaray integer not null,
department_id integer unsigned not null,
primary key (id),
foreign key (department_id)
references department(id)
on delete casscade
);

create table employee (
id integer unsigned auto_increament,
first_name varchar (30) not null,
last_name varchar (30) not null,
role_id integer not null,
manager_id integer not null 
