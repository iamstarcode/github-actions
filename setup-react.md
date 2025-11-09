# Setup React App with NGINX

## Install NGINX
sudo apt update
sudo mkdir -p /var/www/reactapp
sudo chown -R $USER:$USER /var/www/reactapp

## Create NGINX Config
sudo nano /etc/nginx/sites-available/reactapp
```
server {
    listen 80;
    server_name _;

    root /var/www/reactapp;
    index index.html;

    location / {
        try_files $uri /index.html;
    }

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

    location ~* \.(?:ico|css|js|gif|jpe?g|png|woff2?|ttf|svg)$ {
        try_files $uri =404;
        access_log off;
        expires max;
    }
}
```

## Link and reload NGINX
sudo rm /etc/nginx/sites-enabled/default  # optional, remove default site (sometimes causes conflicts)
sudo ln -s /etc/nginx/sites-available/reactapp /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
