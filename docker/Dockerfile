FROM node:20-bullseye-slim

# create app directory
WORKDIR /usr/src/app
COPY . /usr/src/app/
RUN npm ci
RUN npm run build

ARG COMMIT_ID=dev
RUN echo -n $COMMIT_ID > /usr/src/app/.commit