# Base stage
FROM node:latest AS base
WORKDIR /app
COPY package*.json ./
RUN npm install

# Development stage
FROM base AS dev
COPY . .
CMD ["npm", "run", "dev"]

# Production build stage
FROM base AS build
COPY . .
RUN npm run build

# Production dist stage
FROM nginx AS dist
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
