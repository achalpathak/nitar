#!/bin/bash
# changing media folder permission
# chown -R docker_user:docker_user media
# chown -R docker_user:docker_user logs
# chown -R docker_user:docker_user static
# chown -R docker_user:docker_user mysql-data

echo ".............Installing NPM modules............."
cd frontend
yarn install
echo ".............Building Project............."
yarn run build
while ! nc -z mysqldb 3306 ; do
    echo ".............Waiting for the MySQL Server............."
    sleep 3
done
cd ../
echo ".............Starting Server............."
python manage.py migrate
python manage.py collectstatic --noinput --clear
echo ".............Running Gunicorn............."
gunicorn -c config/gunicorn.py
echo ".............Gunicorn Started Successfully............."
tail -f /dev/null #Keeps the docker container running
