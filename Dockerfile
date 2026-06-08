# Use the official Node.js 18 image as the base image
FROM node:18 AS builder

# Set the working directory inside the container
WORKDIR /ETZDirectCBA-Frontend

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --force

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Use a lightweight web server to serve the built files
FROM node:18-slim

# Install 'serve' to serve the static files
RUN npm install -g serve

# Set the working directory to /app
WORKDIR /ETZDirectCBA-Frontend

# Copy the build output from the previous stage
COPY --from=builder /ETZDirectCBA-Frontend/dist ./dist

# Expose port 6062
EXPOSE 6062

# Serve the built files
CMD ["serve", "-s", "dist/browser", "-l", "6062"]
