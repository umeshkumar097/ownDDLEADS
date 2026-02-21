#!/bin/bash
set -e

NGINX_CONF="/etc/nginx/sites-available/dhandaleads.com"

cat << 'EOF' > $NGINX_CONF
server {
    listen 80;
    server_name dhandaleads.com www.dhandaleads.com;

    location / {
        proxy_pass http://localhost:3002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

# Enable the site
ln -sf /etc/nginx/sites-available/dhandaleads.com /etc/nginx/sites-enabled/

# Test Nginx config
nginx -t

# Reload Nginx
systemctl reload nginx

# Install certbot and request SSL cert
apt-get update
apt-get install -y python3-certbot-nginx
certbot --nginx -d dhandaleads.com -d www.dhandaleads.com --non-interactive --agree-tos -m info@aiclex.in --redirect

echo "Nginx and SSL setup complete!"
