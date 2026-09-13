import esbuild from 'esbuild';
import { execSync } from 'child_process';

console.log('⚡ Generating Prisma client...');
execSync('npx prisma generate', { stdio: 'inherit' });

const banner = "import { createRequire } from 'module'; const require = createRequire(import.meta.url);";

console.log('⚡ Bundling server application for Vercel and production...');
// 1. Bundle to src/bundle.generated.mjs (source entrypoint for Vercel's serverless packaging)
await esbuild.build({
  entryPoints: ['src/app.mts'],
  bundle: true,
  platform: 'node',
  target: 'node20',
  format: 'esm',
  banner: { js: banner },
  outfile: 'src/bundle.generated.mjs',
  external: ['@prisma/client'],
});

console.log('⚡ Running TypeScript typecheck and emit...');
execSync('npx tsc', { stdio: 'inherit' });

// 2. Bundle to dist/bundle.generated.mjs (for local production starts node dist/server.mjs)
await esbuild.build({
  entryPoints: ['src/app.mts'],
  bundle: true,
  platform: 'node',
  target: 'node20',
  format: 'esm',
  banner: { js: banner },
  outfile: 'dist/bundle.generated.mjs',
  external: ['@prisma/client'],
});

console.log('✅ Build completed successfully.');
