FROM ubuntu

WORKDIR /app


RUN apt update
RUN apt upgrade -y
RUN apt install nodejs npm -y

COPY package*.json ./
RUN npm install

# Copy app code into container
COPY . .

# RUN npm run build

CMD ["npm", "run", "dev"]
