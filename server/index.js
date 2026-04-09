require('./src/config/env');
const app = require('./src/app');
const { PORT } = require('./src/config/env');
const { startCronJobs } = require('./src/utils/scheduler');
const { runMigrations } = require('./src/db/migrate');

async function start() {
  await runMigrations();
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    startCronJobs();
  });
}

start();
