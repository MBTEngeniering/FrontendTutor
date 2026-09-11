import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  const port = Number(env.VITE_PORT ?? '3003');
  const isProduction = mode === 'production';

  return {
    plugins: [react()],
    publicDir: 'public',
    resolve: {
      alias: {
        '@': '/src',
        ':common': '/src/pages/common',
        ':comp': '/src/components',
        ':pages': '/src/pages',
        ':assets': '/src/assets',
        ':styles': '/src/styles',
      },
    },
    build: {
      target: 'es2020',
      sourcemap: !isProduction,
      cssCodeSplit: true,
      chunkSizeWarningLimit: 900,
      minify: 'esbuild',
      outDir: 'build',
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('react-router')) {
                return 'router';
              }

              if (id.includes('react-big-calendar') || id.includes('@fullcalendar')) {
                return 'calendar';
              }

              if (id.includes('jspdf') || id.includes('html2canvas') || id.includes('canvg')) {
                return 'pdf';
              }

              if (id.includes('sweetalert')) {
                return 'alerts';
              }

              if (id.includes('luxon') || id.includes('date-fns')) {
                return 'date';
              }

              return 'vendor';
            }

            if (id.includes('/src/components')) {
              const route = id.split('/src/components/')[1].split('/')[0];
              return `component-${route}`;
            }

            if (id.includes('/src/pages')) {
              const route = id.split('/src/pages/')[1].split('/')[0];
              return `page-${route}`;
            }
          },
        },
      },
    },
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:8080',
          changeOrigin: true,
        },
      },
      host: '0.0.0.0',
      port,
      strictPort: false,
      hmr: {
        protocol: 'ws',
        host: 'localhost',
        overlay: true,
      },
    },
  };
});

