FROM python:3.11.0
ENV PYTHONBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1


RUN apt-get update && apt-get -y dist-upgrade
RUN apt install -y netcat htop

RUN curl -sL https://deb.nodesource.com/setup_18.x | bash - 
RUN apt-get install -y nodejs

RUN useradd -ms /bin/bash docker_user
WORKDIR /application
COPY . .
RUN chown -R docker_user:docker_user /application
RUN chown -R docker_user:docker_user /usr/lib/node_modules
RUN chown -R docker_user:docker_user /usr/bin
RUN chmod -R 755 /application

RUN chmod -R 775 /application/run_server.sh

RUN npm i -g npm@latest yarn
RUN pip install --upgrade pip
RUN pip install --no-cache-dir --disable-pip-version-check --requirement requirements.txt

RUN mkdir /application/media
RUN mkdir /application/logs
RUN mkdir /application/static
RUN mkdir /application/mysql-data

#media permissions not working
RUN chown -R docker_user:docker_user /application/media 
RUN chown -R docker_user:docker_user /application/logs
RUN chown -R docker_user:docker_user /application/static
RUN chown -R docker_user:docker_user /application/mysql-data

USER docker_user