import { startSourceServer } from './harness.mjs';

const server = await startSourceServer();
process.stdout.write(`${server.url}\n`);

let closing = false;
const close = async () => {
  if (closing) return;
  closing = true;
  await server.close();
  process.exit(0);
};

process.once('SIGINT', close);
process.once('SIGTERM', close);
await new Promise(() => {});
