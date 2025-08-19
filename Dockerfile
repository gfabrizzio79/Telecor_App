# Step 1: Use an official Node.js runtime as a parent image
FROM node:18-slim

# Step 2: Set the working directory in the container
WORKDIR /app

# Step 3: Copy package.json and package-lock.json
COPY package*.json ./

# Step 4: Install any needed packages
RUN npm install

# Step 5: Copy the rest of your app's source code
COPY . .

# Step 6: Build your app for production
RUN npm run build

# Step 7: Expose the port the app runs on
EXPOSE 8080

# Step 8: Serve the app
CMD [ "npx", "serve", "-s", "dist", "-l", "8080" ]