#!/bin/bash
echo ".............Installing NPM modules............."
cd frontend
npm install --legacy-peer-deps
echo ".............Building Project............."
npm run build
while ! nc -z mysqldb 3306 ; do
    echo ".............Waiting for the MySQL Server............."
    sleep 3
done
cd ../
echo ".............Starting Server............."
python manage.py makemigrations
python manage.py collectstatic --noinput --clear
gunicorn -c config/gunicorn.py