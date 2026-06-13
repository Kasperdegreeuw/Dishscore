import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({
    // Relatieve base zodat de app op elk (sub)pad werkt, bijv. GitHub Pages
    // project pages: https://gebruiker.github.io/repo-naam/
    base: './',
    plugins: [react()]
});
