module.exports = {
  apps: [
    {
      name: 'kimjisub-web',
      script: 'node_modules/.bin/next',
      args: 'dev --port 32957 --hostname 127.0.0.1',
      cwd: '/home/kimjisub/.openclaw/workspace/kimjisub',
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: 'development',
      },
    },
  ],
};
