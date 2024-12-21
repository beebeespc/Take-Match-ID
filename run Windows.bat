@echo off

echo Running proxy...
start cmd /k "node server.js"


echo Running server...
start cmd /k "node servermain.js"

echo Please wait for the browser to open.
timeout /t 10 /nobreak

start http://localhost:3115