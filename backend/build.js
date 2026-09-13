import esbuild from 'esbuild';
import { execSync } from 'child_process';

console.log('⚡ Generating Prisma client...');
execSync('npx prisma generate', { stdio: 'inherit' });

const banner = "import { createRequire } from 'module'; const require = createRequire(import.meta.url);";
const footer = `
// Start the server only when running locally (not in serverless production)
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(\`🚀 MessApp Backend API running on port \${PORT}\`);
  });
}
`;

console.log('⚡ Bundling server application into src/server.mts and dist/server.mjs...');

// Bundle into src/server.mts (source entrypoint for Vercel)
await esbuild.build({
  entryPoints: ['src/app.mts'],
  bundle: true,
  platform: 'node',
  target: 'node20',
  format: 'esm',
  banner: { js: banner },
  footer: { js: footer },
  outfile: 'src/server.mts',
  external: ['@prisma/client'],
});

// Bundle into dist/server.mjs (production bundle for node start)
await esbuild.build({
  entryPoints: ['src/app.mts'],
  bundle: true,
  platform: 'node',
  target: 'node20',
  format: 'esm',
  banner: { js: banner },
  footer: { js: footer },
  outfile: 'dist/server.mjs',
  external: ['@prisma/client'],
});

console.log('⚡ Running TypeScript check on app.mts...');
execSync('npx tsc src/app.mts --noEmit --skipLibCheck --target ES2022 --module NodeNext --moduleResolution NodeNext', { stdio: 'inherit' });

console.log('✅ Build completed successfully.');
