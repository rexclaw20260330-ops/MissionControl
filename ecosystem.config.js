module.exports = {
  apps: [{
    name: "mission-control",
    script: "./node_modules/next/dist/bin/next",
    args: "dev",
    cwd: "C:\\Users\\Rex\\.openclaw\\workspace\\mission-control",
    env: {
      NODE_ENV: "development",
      PORT: 3000
    },
    autorestart: true,
    max_restarts: 10,
    min_uptime: "10s"
  }]
};
