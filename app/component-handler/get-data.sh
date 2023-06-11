#!/bin/sh
cd /app/browser-compat-data
git pull 
npm run prepare 
npm run build 
cd /app/data
git pull
cd /app/handler
sh run.sh
sleep 43200