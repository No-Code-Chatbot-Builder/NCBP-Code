# Stage 1: Build the application
FROM node:18-alpine AS build
# Install dependencies only when needed
RUN apk add --no-cache libc6-compat
WORKDIR /app
# Copy only the package.json and package-lock.json to the working directory
COPY package.json package-lock.json ./
# Install npm dependencies
RUN npm ci
# Copy all other project files to the working directory
COPY . .
# Build the Next.js application
RUN npm run build

# Stage 2: Serve the application
FROM node:18-alpine
# Update and install latest dependencies, add dumb-init package
RUN apk upgrade --no-cache && apk add dumb-init

# Set work dir as /app
WORKDIR /app
# Copy the dependencies from the build stage
COPY --from=build /app/node_modules ./node_modules
# Copy the built application from the build stage
COPY --from=build /app/.next ./.next
# Copy the necessary files such as configuration files and public assets
COPY --from=build /app/public ./public
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/next.config.mjs ./next.config.mjs

# Expose port 3000
EXPOSE 80

# Set environment variables
ENV PORT 80
ENV NODE_ENV production

# Command to start the Next.js application
CMD ["dumb-init", "npx", "next", "start"]
