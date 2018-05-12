#---------------------------------------------------------

DROP DATABASE IF EXISTS zhihu;

CREATE DATABASE zhihu;
use zhihu

#---------------------------------------------------------

DROP TABLE IF EXISTS users;

CREATE TABLE users (
	id int(11) unsigned NOT NULL AUTO_INCREMENT,
    created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	email varchar(50) NOT NULL DEFAULT '',
	name varchar(100) NOT NULL,
	password varchar(100) NOT NULL,
	gender tinyint(2)  NOT NULL DEFAULT '-1',
    headline varchar(500) DEFAULT NULL,
    url_token varchar(50) NOT NULL DEFAULT '',
    avatar_url varchar(100) NOT NULL DEFAULT '/static/images/default.jpg',
    marked_count int(11) unsigned DEFAULT 0, #冗余列避免每次计算所有回答的收藏数总和 或将用redis记录收藏
    answer_count int(11) unsigned DEFAULT 0,
    follower_count int(11) unsigned DEFAULT 0,
    following_count int(11) unsigned DEFAULT 0,
	PRIMARY KEY (id)
);

#---------------------------------------------------------

DROP TABLE IF EXISTS questions;

CREATE TABLE questions (
    id int(11) unsigned NOT NULL AUTO_INCREMENT,
    user_id int(11) unsigned NOT NULL,
    title varchar(100) NOT NULL DEFAULT '',
    description longtext,
    created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    answer_count int(11) unsigned NOT NULL DEFAULT 0,
    follower_count int(11) unsigned NOT NULL DEFAULT 0,
    comment_count int(11) unsigned NOT NULL DEFAULT 0,
    PRIMARY KEY (id)
);

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
    PRIMARY KEY (id)
);
    
#---------------------------------------------------------

DROP TABLE IF EXISTS topics;

CREATE TABLE topics (
    id int(11) unsigned NOT NULL AUTO_INCREMENT,
    name varchar(50) NOT NULL DEFAULT '',
    PRIMARY KEY (id)
);

#--------------------------------------------------------

DROP TABLE IF EXISTS question_topics;

CREATE TABLE question_topics (
    question_id int(11) unsigned NOT NULL,
    topic_id int(11) unsigned NOT NULL,
    topic_name varchar(50) NOT NULL,        #冗余列
    PRIMARY KEY (question_id, topic_id)
);

#--------------------------------------------------------

DROP TABLE IF EXISTS answer_comments;

CREATE TABLE answer_comments (
    id int(11) unsigned NOT NULL AUTO_INCREMENT,
    user_id int(11) unsigned NOT NULL,
    answer_id int(11) unsigned NOT NULL,
    created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    content longtext,
    PRIMARY KEY (id)
);

#--------------------------------------------------------

DROP TABLE IF EXISTS question_comments;

CREATE TABLE question_comments (
    id int(11) unsigned NOT NULL AUTO_INCREMENT,
    user_id int(11) unsigned NOT NULL,
    question_id int(11) unsigned NOT NULL,
    created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    content longtext,
    PRIMARY KEY (id)
);

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
email="root",
name="root",
password="root",
headline="a man to look for answer",
url_token="root",
avatar_url="/static/favicon.ico";

INSERT users SET
created_at=now(),
email="qiu",
name="qiu",
password="qiu",
gender=1,
headline="an excellent man",
url_token="qiu",
avatar_url="/static/images/20180428152318.jpg",
follower_count=1,
answer_count=1;

INSERT users SET
created_at=now(),
email="pan",
name="pan",
password="pan",
gender=1,
headline="a handsome man",
url_token="pan";
#--image="/static/images/default.jpg";

INSERT questions SET 
user_id=1,
title="how to be excellent?", 
description="like qiu or pan", 
created_at=now(),
modified_at=now(),
follower_count=1,
answer_count=1,
comment_count=1;

INSERT answers SET
question_id=1,
user_id=2,
content="fuck you",
created_at=now(),
modified_at=now(),
comment_count=1;

INSERT answer_comments SET
user_id=1,
answer_id=1,
created_at=now(),
content="thank u very much";

INSERT question_comments SET
user_id=3,
question_id=1,
created_at=now(),
content="good question!!";

INSERT topics SET 
name="excellence";

INSERT question_topics SET
question_id=1,
topic_id=1,
topic_name="excellence";

INSERT question_followers SET
question_id=1,
user_id=1;

INSERT member_followers SET
member_id=2,
follower_id=1;
