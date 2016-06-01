alter table car_wars_users add column role varchar(20) default 'User';
alter table car_wars_users change column password password varchar(60);
