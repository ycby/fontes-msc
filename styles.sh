#!/bin/sh

stylus --use ./stylus-variables.js --with "{ \"\$base-url\": \"$1\"}" views/styls/* -o public/stylesheets
stylus --use ./stylus-variables.js --with "{ \"\$base-url\": \"$1\"}" -c views/styls/style.styl -o public/stylesheets/minified/style-min.css

