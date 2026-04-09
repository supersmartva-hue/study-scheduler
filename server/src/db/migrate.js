require('../config/env');
const fs = require('fs');
const path = require('path');
const { pool } = require('../config/database');

async function runMigrations() {
  const migrationsDir = path.join(__dirname, 'migrations');
  const files = fs.readdirSync(migrationsDir).sort();

  console.log('Running migrations...');
  for (const file of files) {
    if (!file.endsWith('.sql')) continue;
    const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
    try {
      await pool.query(sql);
      console.log(`  ✓ ${file}`);
    } catch (err) {
      console.error(`  ✗ ${file}: ${err.message}`);
      throw err;
    }
  }
  console.log('Migrations complete.');
}

module.exports = { runMigrations };

// Allow running directly: node src/db/migrate.js
if (require.main === module) {
  runMigrations().then(() => process.exit(0)).catch(() => process.exit(1));
}
