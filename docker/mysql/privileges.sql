use mysql
create user docker identified by '123456';
grant all on zhihu.* to docker@'%' identified by '123456' with grant option;
flush privileges;
