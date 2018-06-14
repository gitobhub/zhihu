#!/bin/bash
service mysql start
mysql -uroot -p123456 < /mysql/zhihu.sql
mysql -uroot -p123456 < /mysql/privileges.sql
tail -f /dev/null
