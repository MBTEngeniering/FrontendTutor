import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'
import terser from '@rollup/plugin-terser';

// https://vite.dev/config/
export default defineConfig(({mode}) => {
      const env = loadEnv(mode, process.cwd());
      const PORT = `${env.VITE_PORT ?? '3003'}`;

      return {
        plugins: [
          react(),
          terser({
            maxWorkers: 8, // Number of workers to use for minification
            compress: {
              drop_console: true, // Keep console.* calls
              drop_debugger: true, // Removes debugger statements
              dead_code: true, // Removes unreachable code
              passes: 2, // Number of compression passes
              unsafe_math: true, // Optimize math expressions
              conditionals: true, // Optimize if-s and conditional expressions
              sequences: true, // Join consecutive simple statements using the comma operator
              booleans: true, // various optimizations for boolean context
              unused: true, // Drop unreferenced functions and variables
              if_return: true, // Optimizations for if/return and if/continue
              join_vars: true, // Join consecutive var statements
            },
            format: {
              preamble: "/* minified */", // Add a comment at the top of the file
              comments: false, // Remove comments
            },
            mangle: {
              properties: false, // Don't rename properties (safer)
            },
          })
        ],
        publicDir: 'public',
        resolve: {
          alias: {
            '@': '/src',
            ':comp': '/src/components',
            ':pages': '/src/pages',
            ':assets': '/src/assets',
            ':styles': '/src/styles',
          }
        },
        build: {
          modulePreload: true, // Keep modulePreload enabled to ensure the best performance
          sourcemap: false, // Disable sourcemaps in production
          cssCodeSplit: true, // Enable CSS code splitting

          // Minification settings (Use terser for minification with aggressive settings)
          minify: 'terser', // Can also use 'esbuild' which is faster but less optimized
          outDir: 'build',
          rollupOptions: {
            output: {
              manualChunks(id) {
                if (id.includes('node_modules/html2canvas')) {
                  return 'vendor-html2canvas';
                }
                if (id.includes('node_modules/react')) {
                  return 'vendor-react';
                }
                if (id.includes('node_modules/jspdf')) {
                  return 'vendor-jspdf';
                }
                if (id.includes('node_modules/@fullcalendar')) {
                  return 'vendor-fullcalendar';
                }
                if (id.includes('node_modules/@daypilot')) {
                  return 'vendor-daypilot';
                }
                if (id.includes('/src/components')) {
                  const route = id.split('/src/components/')[1].split('/')[0];
                  return `page-${route}`;
                }
                // Split routes into individual chunks based on folder structure
                if (id.includes('/src/pages')) {
                  const route = id.split('/src/pages/')[1].split('/')[0];
                  return `page-${route}`;
                }
                if (id.includes('node_modules')) {
                  return 'vendor';
                }
              }
            },
          }
        },
        server: {
          host: '0.0.0.0',
          port: PORT,
          strictPort: true,
          hmr: {
            overlay: true
          }
        }
      }
    }
);

