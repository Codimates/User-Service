FROM node:18

RUN apt-get update && apt-get install -y \
    python3 \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --build-from-source bcrypt
RUN npm install -g nodemon

RUN npm install

COPY . .

EXPOSE 4001

ENV NAME user-service

CMD ["npm", "start"]
