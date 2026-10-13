module.exports = {
  apps: [
    {
      name: 'kimjisub-web',
      script: 'node_modules/next/dist/bin/next',
      args: 'dev --port 32957 --hostname 127.0.0.1',
      cwd: __dirname,
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: 'development',
      },
    },
  ],
};
