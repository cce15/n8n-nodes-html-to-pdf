#!/bin/bash

# Installation script for n8n-nodes-html-to-pdf on remote server
# Usage: ./install-to-server.sh user@your-server

set -e

# Check arguments
if [ -z "$1" ]; then
    echo "❌ Error: Server address required"
    echo "Usage: ./install-to-server.sh user@your-server"
    exit 1
fi

SERVER=$1
PACKAGE_NAME="n8n-nodes-html-to-pdf"

echo "🚀 Installing $PACKAGE_NAME to $SERVER"
echo ""

# Step 1: Build locally
echo "📦 Step 1/5: Building package locally..."
npm install
npm run build

# Step 2: Create tarball
echo "📦 Step 2/5: Creating tarball..."
npm pack

TARBALL=$(ls -t n8n-nodes-html-to-pdf-*.tgz | head -1)
echo "Created: $TARBALL"

# Step 3: Upload to server
echo "📤 Step 3/5: Uploading to server..."
scp $TARBALL $SERVER:/tmp/

# Step 4: Install on server
echo "📥 Step 4/5: Installing on server..."
ssh $SERVER << 'EOF'
# Create custom directory if it doesn't exist
mkdir -p ~/.n8n/custom
cd ~/.n8n/custom

# Install the package
echo "Installing package..."
npm install /tmp/n8n-nodes-html-to-pdf-*.tgz

# Install Playwright browser
echo "Installing Playwright browser..."
npx playwright install chromium

echo "✅ Installation complete!"
EOF

# Step 5: Restart n8n
echo "🔄 Step 5/5: Restarting n8n..."
echo ""
echo "Choose restart method:"
echo "1) systemd (sudo systemctl restart n8n)"
echo "2) PM2 (pm2 restart n8n)"
echo "3) Docker (docker restart n8n-container)"
echo "4) Manual (I'll restart it myself)"
read -p "Enter choice [1-4]: " choice

case $choice in
    1)
        ssh $SERVER "sudo systemctl restart n8n"
        echo "✅ n8n restarted via systemd"
        ;;
    2)
        ssh $SERVER "pm2 restart n8n"
        echo "✅ n8n restarted via PM2"
        ;;
    3)
        ssh $SERVER "docker restart n8n-container"
        echo "✅ n8n container restarted"
        ;;
    4)
        echo "⚠️  Remember to restart n8n manually!"
        ;;
    *)
        echo "⚠️  Invalid choice. Please restart n8n manually."
        ;;
esac

echo ""
echo "🎉 Installation complete!"
echo ""
echo "Next steps:"
echo "1. Open n8n in your browser"
echo "2. Create a new workflow"
echo "3. Search for 'HTML to PDF' node"
echo "4. Test the conversion"
echo ""
echo "Troubleshooting:"
echo "- Check logs: ssh $SERVER 'journalctl -u n8n -f'"
echo "- View this guide: cat REMOTE-INSTALL.md"
