#!/bin/bash
git checkout .;
git pull;

# Restart server (production + dev)
sudo forever stop jam_prod jam_dev;
sudo NODE_ENV=production forever --uid "jam_prod" -a -l node.log -o node.log -e node.log start app.js;
sudo NODE_ENV=development forever --uid "jam_dev" -a -l node-dev.log -o node-dev.log -e node-dev.log start app.js;

