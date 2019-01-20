#! /bin/bash

BUNDLE=./bundle.js
FILES=(
  "utils.js"
  "api.js"  
  "pages/*.js"
  "routing.js"
  "main.js"
)

rm -f $BUNDLE; touch $BUNDLE

for filename in "${FILES[@]}"; do
  awk 'NF' ./src/$filename >> $BUNDLE
done
