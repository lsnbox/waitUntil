FROM node:14-buster

# Create app directory
RUN mkdir -p /app
WORKDIR /app

# add source files
ADD package.json /app
ADD package-lock.json /app

RUN npm install --production

ADD index.js /app


