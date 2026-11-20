import { spawnSync } from 'node:child_process';
for (const command of ['check', 'build']) {
  const result = spawnSync(process.execPath, ['scripts/astro.mjs', command], { stdio:'inherit' });
  if (result.status !== 0) process.exit(result.status ?? 1);
}
