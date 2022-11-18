#!/bin/bash

while ! nc -z mysqldb 3306 ; do
    echo "Waiting for the MySQL Server"
    sleep 3
done
echo "Installing NPM modules............."
cd frontend
npm install --legacy-peer-deps
echo "Building Project............."
npm run build
cd ../
python manage.py runserver 0.0.0.0:8000