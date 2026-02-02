# --- Stage 1: Build the Static Files ---
FROM node AS build-stage

WORKDIR /app

# Copy package files first to leverage Docker caching
COPY package*.json ./
RUN npm install

# Copy the rest of the source code
COPY . .

RUN npm run build

# --- Stage 2: Serve with Nginx ---
FROM nginx AS production-stage

# Copy the build output from the previous stage to Nginx's html directory
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Copy a custom nginx config to handle SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 (internal to the container)
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
