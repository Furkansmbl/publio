/**
 * Publio production process manager (PM2)
 *
 * Servisler:
 *   - publio-backend       → NestJS API     (PORT=3010)
 *   - publio-frontend      → Next.js        (PORT=4200)
 *   - publio-orchestrator  → Temporal/Nest  (ORCHESTRATOR_PORT=3012)
 *
 * Çalıştırma:
 *   pm2 start ecosystem.config.cjs
 *   pm2 save
 *   pm2-startup install   (Windows servisi olarak boot'a yazar)
 */

const path = require('path');
const ROOT = __dirname;
const NODE = 'C:\\Program Files\\nodejs\\node.exe';

module.exports = {
  apps: [
    {
      name: 'publio-temporal',
      cwd: 'C:/temporal',
      script: 'C:/temporal/temporal.exe',
      args: [
        'server',
        'start-dev',
        '--db-filename',
        'C:/temporal/data/temporal.db',
        '--ip',
        '127.0.0.1',
        '--port',
        '7233',
        '--ui-port',
        '8233',
        '--namespace',
        'default',
      ],
      env: {
        TZ: 'UTC',
      },
      max_memory_restart: '1500M',
      restart_delay: 3000,
      max_restarts: 20,
      out_file: 'C:/publio-logs/temporal-out.log',
      error_file: 'C:/publio-logs/temporal-err.log',
      merge_logs: true,
    },
    {
      name: 'publio-backend',
      cwd: ROOT,
      script: NODE,
      args: [
        '--experimental-require-module',
        path.join(ROOT, 'apps/backend/dist/apps/backend/src/main.js'),
      ],
      env: {
        NODE_ENV: 'production',
        TZ: 'UTC',
        PORT: '3010',
      },
      max_memory_restart: '1500M',
      restart_delay: 3000,
      max_restarts: 20,
      out_file: 'C:/publio-logs/backend-out.log',
      error_file: 'C:/publio-logs/backend-err.log',
      merge_logs: true,
    },
    {
      name: 'publio-orchestrator',
      cwd: ROOT,
      script: NODE,
      args: [
        '--experimental-require-module',
        path.join(ROOT, 'apps/orchestrator/dist/apps/orchestrator/src/main.js'),
      ],
      env: {
        NODE_ENV: 'production',
        TZ: 'UTC',
        ORCHESTRATOR_PORT: '3012',
      },
      max_memory_restart: '1500M',
      restart_delay: 3000,
      max_restarts: 20,
      out_file: 'C:/publio-logs/orchestrator-out.log',
      error_file: 'C:/publio-logs/orchestrator-err.log',
      merge_logs: true,
    },
    {
      name: 'publio-frontend',
      cwd: path.join(ROOT, 'apps/frontend'),
      script: NODE,
      args: [
        path.join(
          ROOT,
          'node_modules/next/dist/bin/next'
        ),
        'start',
        '-p',
        '4200',
      ],
      env: {
        NODE_ENV: 'production',
        TZ: 'UTC',
      },
      max_memory_restart: '1500M',
      restart_delay: 3000,
      max_restarts: 20,
      out_file: 'C:/publio-logs/frontend-out.log',
      error_file: 'C:/publio-logs/frontend-err.log',
      merge_logs: true,
    },
  ],
};
