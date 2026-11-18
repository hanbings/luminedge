import { cp, rm } from 'node:fs/promises';

const source = new URL('../../styles/dist/', import.meta.url);
const destination = new URL('../dist/styles/', import.meta.url);

await rm(destination, { recursive: true, force: true });
await cp(source, destination, { recursive: true });
