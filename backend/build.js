import esbuild from 'esbuild';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('⚡ Generating Prisma client and query engine binaries...');
execSync('npx prisma generate', { stdio: 'inherit' });

// Copy Prisma engine binaries to src/ and dist/ so they are co-located in __dirname on Vercel
const prismaDir = path.resolve('node_modules/.prisma/client');
const engineFiles = fs.readdirSync(prismaDir).filter(f => f.startsWith('libquery_engine-') || f.startsWith('query_engine-') || f === 'schema.prisma');

for (const targetDir of ['src', 'dist']) {
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
  for (const file of engineFiles) {
    const srcFile = path.join(prismaDir, file);
    const destFile = path.join(targetDir, file);
    fs.copyFileSync(srcFile, destFile);
  }
}

const banner = `import { createRequire } from 'module';
const require = createRequire(import.meta.url);
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
`;

const footer = `
// Start the server only when running locally (not in serverless production)
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(\`🚀 MessApp Backend API running on port \${PORT}\`);
  });
}
`;

console.log('⚡ Bundling complete application (Express + Prisma runtime) into src/server.mts and dist/server.mjs...');

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
});

console.log('⚡ Running TypeScript check on app.mts...');
execSync('npx tsc src/app.mts --noEmit --skipLibCheck --target ES2022 --module NodeNext --moduleResolution NodeNext', { stdio: 'inherit' });

console.log('✅ Build completed successfully.');
