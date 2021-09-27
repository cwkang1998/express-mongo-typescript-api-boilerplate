const DEPLOY_MACHINE = process.env.DEPLOY_MACHINE;
module.exports = {
  apps: [
    {
      name: 'express-mongo-typescript-api-boilerplate',
      script: 'build/index.js',
      instances: '1',
      exec_mode: 'cluster',
      env_production: {
        NODE_ENV: 'production',
      },
      env_staging: {
        NODE_ENV: 'staging',
      },
    },
  ],

  deploy: {
    production: {
      user: 'ubuntu',
      host: DEPLOY_MACHINE,
      ref: 'origin/master',
      repo: 'git@github.com:cwkang1998/express-mongo-typescript-api-boilerplate.git',
      path: '/home/ubuntu/production/express-mongo-typescript-api-boilerplate',
      'post-deploy':
        'nvm use 14 && npm i && npm run build && pm2 startOrRestart ecosystem.config.js --env production',
    },
    staging: {
      user: 'ubuntu',
      host: DEPLOY_MACHINE,
      ref: 'origin/staging',
      repo: 'git@github.com:cwkang1998/express-mongo-typescript-api-boilerplate.git',
      path: '/home/ubuntu/staging/express-mongo-typescript-api-boilerplate',
      'post-deploy':
        'nvm use 14 && npm i && npm run build && pm2 startOrRestart ecosystem.config.js --env staging',
    },
  },
};
