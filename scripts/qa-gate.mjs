import { spawnSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const run = (label, args) => {
  console.log(`\n[QA-01] ${label}: npm ${args.join(' ')}`);
  const result = spawnSync(npm, args, { cwd: root, stdio: 'inherit', shell: process.platform === 'win32' });
  if (result.error) {
    console.error(`[QA-01] No se pudo iniciar ${label}:`, result.error.message);
    process.exit(1);
  }
  if (result.status !== 0) {
    console.error(`[QA-01] FALLÓ ${label} (código ${result.status ?? 'desconocido'})`);
    process.exit(result.status || 1);
  }
  console.log(`[QA-01] OK: ${label}`);
};

run('TypeScript', ['run', 'check:types']);
run('Compilación de producción', ['run', 'build']);

const dist = join(root, 'dist');
const htmlPath = join(dist, 'index.html');
const assets = join(dist, 'assets');
if (!existsSync(htmlPath) || !existsSync(assets)) {
  console.error('[QA-01] FALLÓ: salida dist incompleta (index.html o assets)');
  process.exit(1);
}
const html = readFileSync(htmlPath, 'utf8');
const js = readdirSync(assets).filter(name => /^index-.*\.js$/.test(name));
if (js.length !== 1 || !html.includes('/assets/')) {
  console.error('[QA-01] FALLÓ: asset JS principal no encontrado o HTML sin referencia a assets');
  process.exit(1);
}
const bytes = statSync(join(assets, js[0])).size;
console.log(`[QA-01] Artefacto verificado: ${js[0]} (${(bytes / 1024).toFixed(1)} KiB)`);
if (bytes > 500_000) console.warn('[QA-01] AVISO no bloqueante: JS principal supera 500 kB. Optimización pendiente.');
console.log('\n[QA-01] GATE AUTOMÁTICO APROBADO. La validación manual de cuatro modos sigue pendiente.');
