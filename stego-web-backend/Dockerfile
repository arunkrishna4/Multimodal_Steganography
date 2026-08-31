FROM node:22-bookworm-slim

# Install Python
RUN apt-get update \
    && apt-get install -y python3 python3-pip \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install Node dependencies
COPY package*.json ./
RUN npm ci

# Copy backend source
COPY . .

# Build TypeScript
RUN npm run build

# Create runtime directories
RUN mkdir -p uploads/output temp

EXPOSE 10000

CMD ["npm", "start"]