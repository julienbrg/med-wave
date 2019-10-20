FROM node:10

RUN apt-get update && \
	apt-get install -y curl dialog apt-utils apt-transport-https

RUN curl --silent --location https://deb.nodesource.com/setup_12.x | bash -

RUN apt-get update && \
	apt-get install -y nodejs npm

WORKDIR /home/app

RUN node -v
RUN npm -v
RUN npm i -g nodemon
RUN nodemon -v
COPY . /home/app 
COPY package.json /home/app
RUN npm install -g npm@latest 
RUN npm install react-scripts@3.0.1 -g --silent
