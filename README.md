 html5-jam
========

Stuff to install
============

install nodejs, npm, mysql-server

Database
========
create database: mysql > CREATE DATABASE htmljam;
mysql > USE htmljam;
populate with test data : mysql > SOURCE ./test/test_data.sql;

Server
======
/server$ npm install
<br>
start server : html5-jam/server$ node server.js
launch unit test : html5-jam/server$ npm test

Client
======
$ npm install -g bower
<br>
$ npm install -g grunt
<br>
$ npm install -g grunt-cli
<br>
html5-jam/client$ npm install | bower install
<br>
start client : html5-jam/client$ grunt serve
 