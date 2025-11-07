import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import viteImagemin from '@vheemstra/vite-plugin-imagemin';
import imageminGifSicle from 'imagemin-gifsicle';
import imageminJpegTran from 'imagemin-jpegtran';
import imageminOptiPng from 'imagemin-optipng';
import imageminSvgo from 'imagemin-svgo';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    viteImagemin({
      plugins: {
        jpg: imageminJpegTran(),
        png: imageminOptiPng(),
        gif: imageminGifSicle(),
        svg: imageminSvgo(),
      },
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return id.toString().split('node_modules/')[1].split('/')[0].toString();
          }
        }
      }
    }
  }
});