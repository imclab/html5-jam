#!/bin/bash
git checkout .;
git pull;

# Restart server (production + dev)
forever stop app.js;
sudo forever -a -l node.log -o node.log -e node.log start app.js;
sudo forever NODE_ENV=development -a -l node-dev.log -o node-dev.log -e node-dev.log start app.js;

