import { defineConfig } from "vite"; //loadEnv為取得env資訊
import vue from "@vitejs/plugin-vue";
import glob from "glob";
import path from "path";

/** plugins */
import eslintPlugin from "vite-plugin-eslint";
import Spritesmith from "vite-plugin-spritesmith";

const scanSpriteFolders = async () => {
  return new Promise((resolve) => {
    glob("./src/assets/sprites/*", (err, paths) => {
      if (err) {
        throw err;
      }
      resolve(paths);
    });
  });
};

const generateSpriteOptions = async () => {
  const options = [];
  const paths = await scanSpriteFolders();

  for (let pathStr of paths) {
    const folder = pathStr.split("/").slice(-1)[0];
    options.push(
      Spritesmith({
        watch: process.env.NODE_ENV === "development",
        src: {
          cwd: `./src/assets/sprites/${folder}`, // 图片源目录
          glob: "*.png", // 匹配所有.png檔案
        },
        target: {
          image: `./src/assets/images/$sprites/${folder}.png`, // 生成的雪碧图的路径
          css: `./src/assets/scss/$sprites/${folder}.scss`, // 生成的css文件的路径
        },
        apiOptions: {
          cssImageRef: `@/assets/images/$sprites/${folder}.png`, // css文件中引用雪碧图的相对路径
        },
      })
    );
  }
  return options;
};

// https://vitejs.dev/config/
export default defineConfig(async () => {
  return {
    base: "./",
    plugins: [
      vue(),
      eslintPlugin({
        cache: false,
      }),
      ...(process.env.NODE_ENV === "development"
        ? await generateSpriteOptions()
        : []),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
      extensions: [".vue", ".js", ".ts"],
    },
    server: {
      port: 8080,
    },
    build: {
      minify: "terser",
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
      },
      chunkSizeWarningLimit: 10000,
    },
  };
});
