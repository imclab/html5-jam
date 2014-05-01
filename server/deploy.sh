#!/bin/bash
git checkout .;
git pull;

# Restart server (production + dev)
sudo forever stop jam_prod;
sudo forever stop  jam_dev;
sudo NODE_ENV=production forever --uid "jam_prod" -a start app.js;
sudo NODE_ENV=development forever --uid "jam_dev" -a start app.js;

