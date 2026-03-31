#!/bin/sh
cd /app/backend && node server.js &
nginx -g "daemon off;"
