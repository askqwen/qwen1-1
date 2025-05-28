
import path from 'path';
import { defineConfig, loadEnv } from 'vite';
// FIX: Import fileURLToPath to define __dirname in ES module
import { fileURLToPath } from 'url';
import process from 'process'; // Added import for process module

export default defineConfig(({ mode }) => {
    // const env = loadEnv(mode, process.cwd(), ''); // No longer needed for API_KEY
    // FIX: Define __filename and __dirname for ES module scope
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    return {
      // define: { // API_KEY is now hardcoded in chat-interface.tsx
      //   'process.env.API_KEY': JSON.stringify(env.API_KEY)
      // },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
