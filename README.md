 html5-jam
========

Stuff to install
============

install nodejs, npm, mysql-server

Database
========
create database: mysql > CREATE DATABASE htmljam;
<br>
mysql > USE htmljam;
<br>
populate with test data : mysql > SOURCE ./test/test_data.sql;

Server
======
html5-jam/server$ npm install
<br>
start server : html5-jam/server$ node server.js
<br>
launch unit tests : html5-jam/server$ npm test

Server APIs Documentation
======
install redis-server
<br>
html5-jam/server/docs$ npm install
<br>
start docs server : html5-jam/server/docs$ npm start
<br>
visit http://localhost:5000


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
start client : html5-jam/client$ grunt server
 