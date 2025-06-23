# Use Node.js v20 base image
FROM node:lts-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your app files
COPY . .

# Expose the default port (change if needed)
EXPOSE 3000

# Start the server
CMD ["npm", "run", "start"]
