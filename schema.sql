
CREATE database bamazon;

use bamazon;

create table products (
	product_id int auto_increment primary key,
	product_name varchar(100) not null,
    department_name varchar (100) not null,
    price int not null,
    stock_quantity int not null
    );


create table departments(
	department_id int auto_increment primary key,
    department_name varchar(100) not null,
    over_head_costs int not null
    );
    
    
alter table products add column product_sales int;


	

