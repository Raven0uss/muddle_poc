FROM node:12

WORKDIR /usr/src/app

COPY . .

RUN cd ./image4ionodeSDK/
RUN npm ci --only=production && npm cache clean --force

RUN cd ..
RUN npm ci --only=production && npm cache clean --force


EXPOSE 4000
CMD [ "node", "-r", "esm", "src/index.js" ]