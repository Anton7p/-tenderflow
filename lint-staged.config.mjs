import path from 'node:path';

function repoRelative(absolutePaths) {
  const cwd = process.cwd();
  return absolutePaths.map((f) => path.relative(cwd, path.resolve(f)).split(path.sep).join('/'));
}

export default {
  'frontend/**/*.{ts,tsx}': (files) => {
    const rel = repoRelative(files);
    return rel.length ? [`npm exec --prefix frontend eslint -- --fix ${rel.join(' ')}`] : [];
  },
  'backend/**/*.ts': (files) => {
    const rel = repoRelative(files);
    return rel.length ? [`npm exec --prefix backend eslint -- --fix ${rel.join(' ')}`] : [];
  },
  '*.{ts,tsx,js,mjs,cjs,json,css,md,yml,yaml}': 'npx prettier --write',
};
