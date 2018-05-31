#---------------------------------------------------------

DROP DATABASE IF EXISTS zhihu;

CREATE DATABASE zhihu;
use zhihu

#---------------------------------------------------------

DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id int(11) unsigned NOT NULL AUTO_INCREMENT,
    created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    email varchar(50) NOT NULL DEFAULT '' UNIQUE,
    fullname varchar(100) NOT NULL,
    password varchar(100) NOT NULL,
    gender tinyint(2)  NOT NULL DEFAULT '-1',
    headline varchar(500) DEFAULT "",
    url_token varchar(50) NOT NULL DEFAULT '' UNIQUE,
    url_token_code int(5) DEFAULT 0,
    avatar_url varchar(100) NOT NULL DEFAULT '/static/images/default.jpg',
    marked_count int(11) unsigned DEFAULT 0, 
    question_count int(11) unsigned DEFAULT 0,
    answer_count int(11) unsigned DEFAULT 0,
    follower_count int(11) unsigned DEFAULT 0,
    following_count int(11) unsigned DEFAULT 0,
    PRIMARY KEY (id)
) DEFAULT CHARSET=utf8;

#---------------------------------------------------------

DROP TABLE IF EXISTS questions;

CREATE TABLE questions (
    id int(11) unsigned NOT NULL AUTO_INCREMENT,
    user_id int(11) unsigned NOT NULL,
    title varchar(100) NOT NULL DEFAULT '',
    detail longtext,
    created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    answer_count int(11) unsigned NOT NULL DEFAULT 0,
    follower_count int(11) unsigned NOT NULL DEFAULT 0,
    comment_count int(11) unsigned NOT NULL DEFAULT 0,
    PRIMARY KEY (id)
) DEFAULT CHARSET=utf8;

#---------------------------------------------------------

DROP TABLE IF EXISTS answers;

CREATE TABLE answers (
    id int(11) unsigned NOT NULL AUTO_INCREMENT,
    question_id int(11) unsigned NOT NULL,
    user_id int(11) unsigned NOT NULL,
    content longtext,
    created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    marked_count int(11) unsigned DEFAULT 0,
    comment_count int(11) unsigned DEFAULT 0,
    is_deleted tinyint(1) DEFAULT 0,
    PRIMARY KEY (id),
    UNIQUE (question_id, user_id)
) DEFAULT CHARSET=utf8;
    
#---------------------------------------------------------

DROP TABLE IF EXISTS topics;

CREATE TABLE topics (
    id int(11) unsigned NOT NULL AUTO_INCREMENT,
    name varchar(50) NOT NULL DEFAULT '' UNIQUE,
    PRIMARY KEY (id)
) DEFAULT CHARSET=utf8;

#--------------------------------------------------------

DROP TABLE IF EXISTS question_topics;

CREATE TABLE question_topics (
    question_id int(11) unsigned NOT NULL,
    topic_id int(11) unsigned NOT NULL,
    PRIMARY KEY (question_id, topic_id)
) DEFAULT CHARSET=utf8;

#--------------------------------------------------------

DROP TABLE IF EXISTS answer_comments;

CREATE TABLE answer_comments (
    id int(11) unsigned NOT NULL AUTO_INCREMENT,
    user_id int(11) unsigned NOT NULL,
    answer_id int(11) unsigned NOT NULL,
    created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    content longtext,
    PRIMARY KEY (id)
) DEFAULT CHARSET=utf8;

#--------------------------------------------------------

DROP TABLE IF EXISTS question_comments;

CREATE TABLE question_comments (
    id int(11) unsigned NOT NULL AUTO_INCREMENT,
    user_id int(11) unsigned NOT NULL,
    question_id int(11) unsigned NOT NULL,
    created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    content longtext,
    PRIMARY KEY (id)
) DEFAULT CHARSET=utf8;  

#--------------------------------------------------------

DROP TABLE IF EXISTS question_followers;

CREATE TABLE question_followers (
    question_id int(11) unsigned NOT NULL,
    user_id int(11) unsigned NOT NULL,
    created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (question_id, user_id)
);

#--------------------------------------------------------

DROP TABLE IF EXISTS member_followers;

CREATE TABLE member_followers (
    member_id int(11) unsigned NOT NULL,
    follower_id int(11) unsigned NOT NULL,
    created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (member_id, follower_id)
);

#--------------------------------------------------------

DROP TABLE IF EXISTS answer_voters;

CREATE TABLE answer_voters (
    id int(11) unsigned NOT NULL AUTO_INCREMENT,
    user_id int(11) unsigned NOT NULL,
    answer_id int(11) unsigned NOT NULL,
    PRIMARY KEY (id)
);

#--------------------------------------------------------

INSERT users SET
created_at=now(),
email="root@root.com",
fullname="root",
password="5508c15e9a9781f58869db41eb17f5c3",
headline="a man to look for answer",
url_token="root",
avatar_url="/static/favicon.ico",
question_count=1;

INSERT users SET
created_at=now(),
email="qiu@qiu.com",
fullname="qiu",
password="d70fcd4ea1b4bfa8d3301f7efe6ac779",
gender=1,
headline="an excellent man",
url_token="qiu",
avatar_url="/static/images/20180428152318.jpg",
follower_count=1;

INSERT users SET
created_at=now(),
email="pan@pan.com",
fullname="pan",
password= "87c8e41d5a549565eba508f243f31d49",
gender=1,
headline="a handsome man",
url_token="pan";

INSERT questions SET 
user_id=1,
title="对于知乎新人你们有什么好的建议？", 
detail="我是一个知乎的新用户，各位大大们有什么好的关注话题推荐一下，或者一些好的建议，或者您认为有用的东西，都推荐一下。
我的好奇心比较重，所以关注的东西比较多，但我不介意再多一点", 
created_at=now(),
modified_at=now(),
follower_count=1,
comment_count=1;

INSERT question_comments SET
user_id=3,
question_id=1,
created_at=now(),
content="good question!!";

INSERT topics SET 
name="知乎";

INSERT question_topics SET
question_id=1,
topic_id=1;

INSERT question_followers SET
question_id=1,
user_id=1;

INSERT member_followers SET
member_id=2,
follower_id=1;

INSERT INTO topics (name) VALUES
("足球"),
("篮球"),
("排球"),
("游戏"),
("优秀"),
("你好"),
("电脑"),
("编程");
