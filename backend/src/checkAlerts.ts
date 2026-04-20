import { db } from './db/index.js';
import * as schema from './db/schema.js';
import { eq } from 'drizzle-orm';

async function run() {
  console.log("Checking DB directly...");
  const allAlerts = await db.select().from(schema.alerts);
  console.log(`Total alerts in system: ${allAlerts.length}`);
  
  if (allAlerts.length > 0) {
    console.log("Sample alert:", allAlerts[0]);
  }

  const locAlerts = await db.select().from(schema.alerts).where(eq(schema.alerts.locationId, 'DL-BDP-100234567'));
  console.log(`Alerts for DL-BDP-100234567: ${locAlerts.length}`);
  
  process.exit(0);
}

run().catch(console.error);
