--liquibase formatted sql

--changeset bob:1
create table test1 (
id int primary key,
name varchar(255)
);

--changeset madesh:2
insert into test1
values(1,'ganesh');


--changeset madesh:3
insert into test1
values(2,'ganesh');


--changeset madesh:4
insert into test1
values(3,'sushma');


--changeset madesh:5
insert into test1
values(4,'sushma');