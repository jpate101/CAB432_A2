#FROM alpine:latest
FROM node:latest
#FROM ubuntu:16.04
#FROM python:3.8-slim-buster
WORKDIR /app
COPY . . 
#RUN npm install

#RUN apt-get update || : && apt-get install python -y
#RUN apt-get install python3-pip -y

RUN apt-get update
RUN apt-get install curl

#RUN curl -sL https://www.python.org/ftp/python/3.10.0/Python-3.10.0.tgz | bash -
RUN apt-get install -y python
RUN apt-get install -y python-pip

#RUN apt-get update
#RUN apt-get install python3 -y

#RUN apt-get install nodejs

RUN npm install

RUN pip install textblob
RUN pip install vaderSentiment

RUN npm install
RUN npm install render

EXPOSE 9000
CMD ["node", "app.js"]