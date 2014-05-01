html5-jam
========

###Stuff to install

install nodejs, npm, mysql-server
install ffmpeg (on 14.04 and above : sudo add-apt-repository ppa:jon-severinsson/ffmpeg && sudo apt-get update -qq)

###Database

create databases htmljam and htmljam_dev;

###Server

html5-jam/server$ npm install
<br>
start server : html5-jam/server$ NODE_ENV=development node app.js

###Client

$ npm install -g bower
<br>
$ npm install -g grunt
<br>
$ npm install -g grunt-cli
<br>
html5-jam/client$ npm install | bower install
<br>
start client : html5-jam/client$ grunt server
 