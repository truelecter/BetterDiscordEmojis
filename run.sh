#!/bin/bash
if node index; then
	echo "Tests passed successfully"
	exit 0
fi 

echo "New file generated. Adding it to repo..."
cd remote_code
git pull
npm install
cp -f ../webpackModuleNumbers.js ./src/
git add src/webpackModuleNumbers.js
git commit -m "Updated module numbers"
git push
npm run deploy
