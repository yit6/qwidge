# Dockerfile
FROM node:22

# Create app directory
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --production

# Copy rest of the app
COPY . .
ADD .env.docker .env

# Expose port
EXPOSE 8080

# Run the app
CMD ["npm", "start"]

