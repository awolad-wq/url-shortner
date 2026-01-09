# Stage 1: Build the app
FROM node:20-alpine AS build
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the client code
COPY . .

# Build the app (uses Vite)
RUN npm run build


# Stage 2: Serve with Nginx
FROM nginx:alpine 

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD [ "nginx", "-g", "daemon off;" ]