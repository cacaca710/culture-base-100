@echo off
cd /d %~dp0
start http://localhost:8347
node server.js
