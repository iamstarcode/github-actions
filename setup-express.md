# Setup Express App with NGINX Proxy

## Install NGINX (if not already done for React app)

sudo apt update
sudo mkdir -p /var/www/expressapi
sudo chown -R $USER:$USER /var/www/expressapi

## Install Node.js and PM2

curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo npm install -g pm2 pnpm

## Update NGINX Config for React App

Edit `/etc/nginx/sites-available/reactapp` (created in React setup) to add the following `/api` location block inside the server block, which proxies requests to the Express app on localhost:3000 (adjust port if needed):

```
location /api {
    proxy_pass http://localhost:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_cache_bypass $http_upgrade;
}
```

## Reload NGINX

sudo nginx -t
sudo systemctl reload nginx
