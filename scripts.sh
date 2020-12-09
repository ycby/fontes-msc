#!/bin/sh

uglifyjs public/javascripts/all.js -c -m -d baseUrl="$1" -o public/javascripts/minified/all-min.js
uglifyjs public/javascripts/searchpage.js -c -m -d baseUrl="$1" -o public/javascripts/minified/searchpage-min.js
uglifyjs public/javascripts/bibliographypage.js -c -m -d baseUrl="$1" -o public/javascripts/minified/bibliographypage-min.js

