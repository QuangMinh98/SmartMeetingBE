FROM node:14.8.0-alpine
WORKDIR /usr/smart-meeting
COPY package*.json ./
COPY tsconfig.json ./
COPY tsconfig.build.json ./
COPY nest-cli.json ./
COPY . .
RUN npm install 
RUN npm run build
CMD npm run start:prod