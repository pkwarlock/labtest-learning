#!/bin/bash
set -ex
exec > /var/log/user-data.log 2>&1

# Install dependencies
dnf install -y nginx git
curl -fsSL https://rpm.nodesource.com/setup_20.x | bash -
dnf install -y nodejs

# Write nginx config
cat > /etc/nginx/conf.d/shellquest.conf <<'NGINX'
server {
    listen 80;
    server_name _;
    root /home/ec2-user/app/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://127.0.0.1:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
NGINX

rm -f /etc/nginx/conf.d/default.conf

# Clone and build app
if [ -n "${GIT_REPO_URL}" ]; then
  git clone ${GIT_REPO_URL} /home/ec2-user/app
else
  mkdir -p /home/ec2-user/app
fi
chown -R ec2-user:ec2-user /home/ec2-user/app

if [ -d /home/ec2-user/app/frontend ]; then
  cd /home/ec2-user/app/frontend
  sudo -u ec2-user npm install
  sudo -u ec2-user npm run build
fi

if [ -d /home/ec2-user/app/backend ]; then
  cd /home/ec2-user/app/backend
  sudo -u ec2-user npm install

  cat > /etc/systemd/system/shellquest.service <<'SVC'
[Unit]
Description=ShellQuest Backend
After=network.target

[Service]
User=ec2-user
WorkingDirectory=/home/ec2-user/app/backend
ExecStart=/usr/bin/node server.js
Restart=always
Environment=PORT=3001

[Install]
WantedBy=multi-user.target
SVC

  systemctl daemon-reload
  systemctl enable --now shellquest
fi

systemctl enable --now nginx
