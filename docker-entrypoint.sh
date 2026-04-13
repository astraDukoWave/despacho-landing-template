#!/bin/sh
set -e
export WA_NUMBER="${WA_NUMBER:-}"
envsubst '${WA_NUMBER}' < /usr/share/nginx/html/config.template.js > /usr/share/nginx/html/config.js
exec nginx -g "daemon off;"
