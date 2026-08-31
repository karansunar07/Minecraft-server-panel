# Deployment

1. Copy `.env.example` to `.env`.
2. Set `SESSION_SECRET`, `DATABASE_URL`, `APP_URL`, and `API_URL`.
3. For a real Pterodactyl installation, set `PROVIDER=pterodactyl`, `PTERODACTYL_URL`, and `PTERODACTYL_API_KEY`.
4. Start the stack:

```bash
docker compose up --build
```

Reverse proxy example:

```nginx
server {
  server_name panel.example.com;

  location / {
    proxy_pass http://frontend:80;
  }

  location /api/ {
    proxy_pass http://backend:4000;
  }

  location /ws/ {
    proxy_pass http://backend:4000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
  }
}
```

This setup coexists with an existing Pterodactyl panel because it talks to Pterodactyl through the provider layer instead of replacing it.
