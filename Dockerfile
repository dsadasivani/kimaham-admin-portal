# Use Node.js as the base image
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the Angular application source code
COPY . .

# Build the Angular application in production mode
# RUN npm run build

# # Install http-server-spa globally
# RUN npm install -g http-server-spa

# Expose the port that the app will run on
EXPOSE 4204

# Run the app with http-server-spa
CMD ["ng serve"]
