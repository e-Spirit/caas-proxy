FROM mhart/alpine-node:8
WORKDIR /app
COPY package.json .
COPY main.js .
RUN npm install
CMD node main.js