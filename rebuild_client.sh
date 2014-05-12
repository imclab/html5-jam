#!/bin/bash
git checkout .;
git pull;

# build dev client
cd client;
grunt build;
