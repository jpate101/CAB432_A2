FROM node:latest
#FROM python:3.8-slim-buster
WORKDIR /app
COPY . . 
RUN npm install

#RUN apt-get update || : && apt-get install python -y
#RUN apt-get install python3-pip -y

#RUN pip install textblob 
#RUN pip install vaderSentiment
EXPOSE 9000
CMD ["node", "app.js"]