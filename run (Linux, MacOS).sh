#!/bin/bash

echo "Running proxy..."
gnome-terminal -- bash -c "cd my-proxy-server && node server.js; exec bash"

echo "Running server..."
gnome-terminal -- bash -c "node servermain.js; exec bash"

xdg-open http://localhost:3115