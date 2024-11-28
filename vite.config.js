import react from "@vitejs/plugin-react";
import { transformWithEsbuild } from "vite";
import restart from "vite-plugin-restart";
import glsl from "vite-plugin-glsl"; // Import the plugin

export default {
  root: "src/",
  publicDir: "../public/",
  plugins: [
    // Restart server on static/public file change
    restart({ restart: ["../public/**"] }),

    // React support
    react(),

    // GLSL file support
    glsl({
      include: /\.(glsl|vs|fs|vert|frag)$/i, // Match GLSL file extensions
    }),

    // .js file support as if it was JSX
    {
      name: "load+transform-js-files-as-jsx",
      async transform(code, id) {
        if (!id.match(/src\/.*\.js$/)) return null;

        return transformWithEsbuild(code, id, {
          loader: "jsx",
          jsx: "automatic",
        });
      },
    },
  ],
  assetsInclude: ["**/*.glb"], // Treat .glb files as assets
  server: {
    host: true, // Open to local network and display URL
    open: !("SANDBOX_URL" in process.env || "CODESANDBOX_HOST" in process.env), // Open if not on CodeSandbox
  },
  build: {
    outDir: "../dist", // Output in the dist/ folder
    emptyOutDir: true, // Empty the folder first
    sourcemap: true, // Add sourcemap
  },
};
