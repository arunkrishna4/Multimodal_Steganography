FROM node:22-bookworm-slim

# Install Python
RUN apt-get update \
    && apt-get install -y python3 python3-pip \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install Node dependencies
COPY package*.json ./
RUN npm ci

# Install Python dependencies
COPY python/requirements.txt ./python/requirements.txt
RUN pip3 install --break-system-packages --no-cache-dir -r python/requirements.txt

# Copy application source
COPY . .

# Build TypeScript
RUN npm run build

# Create runtime directories
RUN mkdir -p uploads/output temp

EXPOSE 10000

CMD ["npm", "start"]