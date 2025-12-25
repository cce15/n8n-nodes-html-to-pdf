# Remote Server Installation Guide

How to install the HTML to PDF node on your n8n server.

## Method 1: Upload Package to Server (Recommended for Custom Nodes)

### Step 1: Package the node locally

```bash
cd n8n-nodes-html-to-pdf
npm install
npm run build
```

### Step 2: Create tarball

```bash
npm pack
```

This creates `n8n-nodes-html-to-pdf-1.0.0.tgz`

### Step 3: Upload to server

```bash
# Upload tarball to your server
scp n8n-nodes-html-to-pdf-1.0.0.tgz user@your-server:/tmp/
```

### Step 4: SSH into server and install

```bash
ssh user@your-server

# Navigate to n8n custom nodes directory
cd ~/.n8n/custom

# Install from tarball
npm install /tmp/n8n-nodes-html-to-pdf-1.0.0.tgz

# Install Playwright browser
npx playwright install chromium
```

### Step 5: Restart n8n

**If using systemd:**
```bash
sudo systemctl restart n8n
```

**If using PM2:**
```bash
pm2 restart n8n
```

**If using Docker (see Method 4)**

---

## Method 2: Install from Git Repository

### Step 1: Push to Git repository

```bash
cd n8n-nodes-html-to-pdf
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/n8n-nodes-html-to-pdf.git
git push -u origin main
```

### Step 2: Install on server from Git

```bash
ssh user@your-server
cd ~/.n8n/custom

# Install directly from GitHub
npm install https://github.com/yourusername/n8n-nodes-html-to-pdf.git

# Install Playwright browser
npx playwright install chromium
```

### Step 3: Restart n8n

---

## Method 3: Manual File Transfer

### Step 1: Build locally

```bash
cd n8n-nodes-html-to-pdf
npm install
npm run build
```

### Step 2: Copy entire folder to server

```bash
# From your local machine
scp -r n8n-nodes-html-to-pdf user@your-server:/tmp/
```

### Step 3: Install on server

```bash
ssh user@your-server
cd ~/.n8n/custom

# Move the folder
mv /tmp/n8n-nodes-html-to-pdf ./

# Install dependencies
cd n8n-nodes-html-to-pdf
npm install --production

# Install Playwright browser
npx playwright install chromium

# Link to n8n
cd ~/.n8n/custom
npm link n8n-nodes-html-to-pdf
```

### Step 4: Restart n8n

---

## Method 4: Docker Installation

If your n8n runs in Docker, you need to modify the Docker setup.

### Option A: Custom Dockerfile

Create a `Dockerfile`:

```dockerfile
FROM n8nio/n8n:latest

USER root

# Copy node package
COPY n8n-nodes-html-to-pdf /data/custom/n8n-nodes-html-to-pdf

# Install the node
WORKDIR /data/custom/n8n-nodes-html-to-pdf
RUN npm install --production

# Install Playwright and browsers
RUN npx playwright install-deps
RUN npx playwright install chromium

WORKDIR /data
USER node
```

Build and run:

```bash
docker build -t n8n-custom .
docker run -it --rm \
  --name n8n \
  -p 5678:5678 \
  -v ~/.n8n:/home/node/.n8n \
  n8n-custom
```

### Option B: Docker Compose with Volume

Create/update `docker-compose.yml`:

```yaml
version: '3'

services:
  n8n:
    image: n8nio/n8n:latest
    restart: always
    ports:
      - "5678:5678"
    environment:
      - N8N_CUSTOM_EXTENSIONS=/data/custom
    volumes:
      - ~/.n8n:/home/node/.n8n
      - ./n8n-nodes-html-to-pdf:/data/custom/n8n-nodes-html-to-pdf
    command: /bin/sh -c "cd /data/custom/n8n-nodes-html-to-pdf && npm install && npx playwright install chromium && n8n start"
```

Then:

```bash
docker-compose up -d
```

### Option C: Install in Running Container

```bash
# Copy package to container
docker cp n8n-nodes-html-to-pdf n8n-container:/data/custom/

# Execute in container
docker exec -it n8n-container /bin/sh

# Inside container
cd /data/custom
npm install ./n8n-nodes-html-to-pdf
npx playwright install-deps
npx playwright install chromium
exit

# Restart container
docker restart n8n-container
```

---

## Method 5: Publish to npm (Public/Private)

### For Public npm

```bash
# Login to npm
npm login

# Publish
cd n8n-nodes-html-to-pdf
npm publish
```

Then on server:

```bash
ssh user@your-server
cd ~/.n8n/custom
npm install n8n-nodes-html-to-pdf
npx playwright install chromium
```

### For Private npm Registry

```bash
# Configure private registry
npm config set registry https://your-private-registry.com

# Publish
npm publish

# On server
ssh user@your-server
cd ~/.n8n/custom
npm config set registry https://your-private-registry.com
npm install n8n-nodes-html-to-pdf
npx playwright install chromium
```

---

## Verification

After installation, verify the node is working:

### 1. Check n8n logs

```bash
# Systemd
sudo journalctl -u n8n -f

# PM2
pm2 logs n8n

# Docker
docker logs -f n8n-container
```

Look for:
```
Loaded custom node: n8n-nodes-html-to-pdf
```

### 2. Check in n8n UI

1. Open n8n in browser
2. Create new workflow
3. Click "+" to add node
4. Search for "HTML to PDF"
5. Node should appear in the list

### 3. Test conversion

Create a simple workflow:
- Add HTML to PDF node
- Set Input Source: HTML Content
- Set HTML Content: `<h1>Test</h1>`
- Set Output Options: Return Binary Data
- Execute

---

## Troubleshooting

### Node not appearing

```bash
# Check if installed
cd ~/.n8n/custom
npm list n8n-nodes-html-to-pdf

# Reinstall if needed
npm install --force n8n-nodes-html-to-pdf
```

### Playwright browser missing

```bash
# Install browsers
npx playwright install chromium

# Or with dependencies (Linux)
npx playwright install-deps
npx playwright install chromium
```

### Permission errors (Docker)

```bash
# Fix permissions
docker exec -u root n8n-container chown -R node:node /data/custom
docker restart n8n-container
```

### Memory issues

Add to n8n environment:

```bash
# Systemd: Edit /etc/systemd/system/n8n.service
Environment="NODE_OPTIONS=--max-old-space-size=4096"

# Docker: Add to docker-compose.yml
environment:
  - NODE_OPTIONS=--max-old-space-size=4096
```

---

## Server Requirements

### Minimum

- Node.js 18+
- 2GB RAM (for Playwright)
- 500MB disk space (for Chromium)

### Recommended

- Node.js 20+
- 4GB RAM
- 1GB disk space

### Linux Dependencies

On Linux servers, install Playwright dependencies:

```bash
# Ubuntu/Debian
sudo apt-get install -y \
  libnss3 \
  libnspr4 \
  libatk1.0-0 \
  libatk-bridge2.0-0 \
  libcups2 \
  libdrm2 \
  libxkbcommon0 \
  libxcomposite1 \
  libxdamage1 \
  libxfixes3 \
  libxrandr2 \
  libgbm1 \
  libasound2

# Or use Playwright's helper
npx playwright install-deps chromium
```

---

## Security Considerations

### Firewall

Ensure n8n port (default 5678) is accessible:

```bash
sudo ufw allow 5678/tcp
```

### File Permissions

```bash
# Set proper ownership
chown -R n8n-user:n8n-group ~/.n8n/custom

# Set permissions
chmod -R 755 ~/.n8n/custom
```

### Updates

To update the node:

```bash
cd ~/.n8n/custom
npm update n8n-nodes-html-to-pdf
# Or reinstall from tarball/git
```

---

## Performance Tuning

### For high-volume usage

1. **Increase Node.js memory:**
```bash
export NODE_OPTIONS="--max-old-space-size=4096"
```

2. **Limit concurrent executions in n8n:**
```bash
export N8N_CONCURRENCY_PRODUCTION_LIMIT=5
```

3. **Use headless Chromium flags:**
Edit HtmlToPdf.node.ts and add launch args:
```typescript
browser = await chromium.launch({
  args: ['--no-sandbox', '--disable-setuid-sandbox']
});
```

---

## Quick Reference

**Most Common Method (Upload Tarball):**

```bash
# Local
npm pack
scp n8n-nodes-html-to-pdf-1.0.0.tgz user@server:/tmp/

# Server
ssh user@server
cd ~/.n8n/custom
npm install /tmp/n8n-nodes-html-to-pdf-1.0.0.tgz
npx playwright install chromium
sudo systemctl restart n8n
```

Done!
