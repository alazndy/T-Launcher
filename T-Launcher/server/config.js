const path = require('path');

// Resolve sibling directories
const resolvePath = (dir) => path.join(__dirname, '../../', dir);

module.exports = {
  apps: [
    {
      id: 'envi',
      name: 'ENV-I (Inventory)',
      description: 'Stok ve Envanter Yönetimi',
      path: resolvePath('ENV-I-main'),
      port: 3000,
      color: 'emerald',
      cmd: {
        dev: 'pnpm dev',
        prod: 'pnpm build; if ($?) { pnpm start }',
        install: 'pnpm install'
      }
    },
    {
      id: 'uph',
      name: 'UPH (Project Hub)',
      description: 'Proje Yönetim Merkezi',
      path: resolvePath('UPH-main'),
      port: 3001,
      color: 'violet',
      cmd: {
        dev: 'pnpm dev',
        prod: 'pnpm build; if ($?) { pnpm start }',
        install: 'pnpm install'
      }
    },
    {
      id: 'market',
      name: 't-Market',
      description: 'E-Ticaret Platformu',
      path: resolvePath('t-Market'),
      port: 3002,
      color: 'blue',
      cmd: {
        dev: 'pnpm dev',
        prod: 'pnpm build; if ($?) { pnpm start }',
        install: 'pnpm install'
      }
    },
    {
      id: 'weave',
      name: 'Weave',
      description: 'Kumaş Tasarım Aracı',
      path: resolvePath('Weave-main'),
      port: 3004,
      color: 'rose',
      cmd: {
        dev: 'pnpm dev',
        prod: 'pnpm build; if ($?) { pnpm preview }',
        install: 'pnpm install'
      }
    },
    {
      id: 'tsa',
      name: 'T-SA',
      description: 'Teknik Spesifikasyon Analizi',
      path: resolvePath('T-SA/code'),
      port: 5173,
      color: 'amber',
      cmd: {
        dev: 'pnpm dev',
        prod: 'pnpm build; if ($?) { pnpm preview }',
        install: 'pnpm install'
      }
    },
    {
      id: 'renderci',
      name: 'RenderCi',
      description: 'Render & Batch Process',
      path: resolvePath('Renderci/code'),
      port: 5174,
      color: 'fuchsia',
      cmd: {
        dev: 'pnpm dev',
        prod: 'pnpm build; if ($?) { pnpm preview }',
        install: 'pnpm install'
      }
    }
  ]
};
