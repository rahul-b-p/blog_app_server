# Use Node.js LTS image
FROM node:22.16.0

# Set working directory
WORKDIR /usr/src/app

# Copy files
COPY package*.json ./
RUN npm install

COPY . .

# Expose port (match your Express port)
EXPOSE 3000

# Build Project 
RUN npm run build

# Run app
CMD ["npm", "start"]
