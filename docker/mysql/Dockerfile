FROM mysql:5.7
MAINTAINER dockerobhub <lgob_123@163.com>
ADD zhihu.sql /mysql/
ADD privileges.sql /mysql/
ADD setup.sh /mysql/
EXPOSE 3306
CMD ["bash", "/mysql/setup.sh"]
