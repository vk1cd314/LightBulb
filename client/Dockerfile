# Use node image
FROM node:latest

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the src
COPY . .

# Build the app
RUN npm run build

# Run the app
CMD ["npm", "run", "preview"]

# Expose the port 
EXPOSE 4173
