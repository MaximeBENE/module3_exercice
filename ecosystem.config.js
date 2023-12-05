module.exports = {
  apps: [
    {
      name: "app",
      script: "./www/app.js",
      error_file: "./errors/unauthorized.js",
      out_file: "./errors/not-found.js",
      max_memory_restart: "200M",
      instace: 3,
      env_production: {
        NODE_ENV: "production",
      },
    },
  ],
};
// commande : pm2 start ecosystem.config.js –env production