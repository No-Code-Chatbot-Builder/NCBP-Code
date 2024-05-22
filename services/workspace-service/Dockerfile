# import the base node image from docker hub
FROM node:20-alpine

# Set the working directort to /app
WORKDIR /app

# Copy package.json and package-lock.json to /app
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the current directory remaining contents to the container at /app
COPY . .

# Expose port 80 to allow communication to and from the container
EXPOSE 80

# Run the app
CMD ["npm", "run", "start"]
