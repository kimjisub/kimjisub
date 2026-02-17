module.exports = {
  apps: [
    {
      name: 'kimjisub-web',
      script: 'npm',
      args: 'run dev',
      cwd: '/home/kimjisub/.openclaw/workspace/kimjisub',
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: 'development',
      },
    },
  ],
};
