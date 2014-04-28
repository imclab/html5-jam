#!/bin/bash
git checkout .;
git pull;

# Restart server
forever stop app.js;
sudo forever -a -l node.log -o node.log -e node.log IS_PROD=1 start app.js;