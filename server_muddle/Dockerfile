FROM node:12

COPY . /usr/src/app

WORKDIR /usr/src/app

RUN npm ci --only=production

EXPOSE 4000
CMD [ "node", "-r", "esm", "src/index.js" ]