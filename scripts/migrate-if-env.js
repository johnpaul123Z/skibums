#!/usr/bin/env node
const url = process.env.DATABASE_URL;
if (url && (url.startsWith("postgresql://") || url.startsWith("postgres://"))) {
  process.exit(0);
}
process.exit(1);
