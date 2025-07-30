# Use official Node.js slim image (small, secure)
FROM node:18-slim

# Create app directory
WORKDIR /app

# Install dependencies (only production)
COPY package*.json ./
RUN npm ci --omit=dev

# Copy source files
COPY . .

# Create non-root user and switch
RUN useradd --system --create-home --shell /bin/false nodeuser && \
    chown -R nodeuser:nodeuser /app
USER nodeuser

# Expose the app port
EXPOSE 3000

# Health check built into compose, so not mandatory here

# Run the app
CMD ["npm", "start"]
