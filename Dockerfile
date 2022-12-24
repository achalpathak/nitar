FROM python:3.11.0
ENV PYTHONBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1


RUN apt-get update && apt-get -y dist-upgrade
RUN apt install -y netcat htop

RUN curl -sL https://deb.nodesource.com/setup_18.x | bash - 
RUN apt-get install -y nodejs

RUN useradd -ms /bin/bash docker_user
WORKDIR /home/docker_user/application
COPY . .
RUN chown -R docker_user:docker_user /home/docker_user/application

RUN chmod +x run_server.sh

RUN npm i -g npm@latest yarn
RUN pip install --upgrade pip
RUN pip install --no-cache-dir --disable-pip-version-check --requirement requirements.txt

# RUN mkdir media
# RUN mkdir logs
# RUN mkdir static
# RUN mkdir mysql-data

# RUN chown -R docker_user:docker_user media 
# RUN chown -R docker_user:docker_user logs
# RUN chown -R docker_user:docker_user static
# RUN chown -R docker_user:docker_user mysql-data

# RUN chmod -R 755 media
# RUN chmod -R 755 logs
# RUN chmod -R 755 static
# RUN chmod -R 755 mysql-data
USER docker_user
EXPOSE 8000