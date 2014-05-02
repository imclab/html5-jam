html5-jam
========

###Stuff to install

install nodejs, npm, mysql-server
install ffmpeg (on 14.04 and above : sudo add-apt-repository ppa:jon-severinsson/ffmpeg && sudo apt-get update -qq)

###Database

create databases htmljam and htmljam_dev;

###Server

#####Installation 
> npm install
<br>
#####Start local server
> bash start_local_server.sh

###Client

#####Installation 
> npm install -g bower | npm install -g grunt | npm install -g grunt-cli
<br>
> npm install | bower install
<br>
#####Start local server
> grunt dev
 