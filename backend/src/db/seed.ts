import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { db } from './index.js';
import * as schema from './schema.js';
import logger from '../utils/logger.js';
import { any } from 'zod';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const seed = async () => {
  logger.info('🌱 Starting JSON-driven database seeding...');

  try {
    // 1. Load JSON data
    const dataPath = path.join(__dirname, '../data/smart energy mock db (1).json');
    const rawData = await fs.readFile(dataPath, 'utf-8');
    const data = JSON.parse(rawData);

    // 2. Clear existing data (in reverse order of foreign keys)
    logger.info('🧹 Cleaning existing data...');
    await db.delete(schema.paymentTransaction);
    await db.delete(schema.billingHistory);
    await db.delete(schema.currentBill);
    await db.delete(schema.alerts);
    await db.delete(schema.applianceSessions);
    await db.delete(schema.loadGraphs);
    await db.delete(schema.activeAppliances);
    await db.delete(schema.acInsights);
    await db.delete(schema.evInsights);
    // MUST delete billing forecast before locations
    await db.delete(schema.billingForecast);
    await db.delete(schema.locations);
    await db.delete(schema.users);

    // 3. Seed User
    logger.info(`👤 Seeding user: ${data.user.name}`);
    await db.insert(schema.users).values({
      ...data.user,
      p2pWalletBalance: data.user.p2pWalletBalance.toString(),
      joinedDate: new Date(data.user.joinedDate),
    });

    // 4. Seed Locations and nested data
    for (const loc of data.locations) {
      logger.info(`📍 Seeding location: ${loc.locationName}`);

      await db.insert(schema.locations).values({
        locationId: loc.locationId,
        userId: data.user.userId,
        locationName: loc.locationName,
        locationType: loc.locationType,
        address: loc.address,
        lat: loc.coordinates.lat.toString(),
        lng: loc.coordinates.lng.toString(),
        meterNumber: loc.meterNumber,
        connectedSince: new Date(loc.connectedSince),
        sanctionedLoad: loc.sanctionedLoad,
        tariffSlab: loc.tariffSlab,
        dashboardMetrics: loc.dashboard,
      });

      // 4a. Seed Bill Forecast (NEW ADDITION)
      if (loc.dashboard?.billForecast) {
        logger.info(`  💰 Seeding bill forecast for ${loc.locationId}`);
        const forecast = loc.dashboard.billForecast;

        await db.insert(schema.billingForecast).values({
          locationId: loc.locationId,
          billForecast: forecast.projectedAmount,
          aiConfidenceScore: forecast.aiConfidenceScore,
          forecastedDate: new Date(forecast.forecastedDate),
          // Convert "UP"/"DOWN" to positive/negative floats
          vsLastMonth: forecast.vsLastMonth.direction === 'UP'
            ? forecast.vsLastMonth.changePercent
            : -forecast.vsLastMonth.changePercent,
        });
      }

      // 4b. Seed EV Insights
      if (loc.evStorageInsights) {
        logger.info(`  🚗 Seeding EV insights for ${loc.locationId}`);
        const ev = loc.evStorageInsights;
        await db.insert(schema.evInsights).values({
          locationId: loc.locationId,
          chargingNow: ev.chargingNow,
          currentChargingKw: ev.currentChargingKw,
          evSharePercentage: ev.last30DaysImpact.evSharePercentage,
          totalEvEnergyKwh: ev.last30DaysImpact.totalEvEnergyKwh,
          totalEvCostInr: ev.last30DaysImpact.totalEvCostInr,
          avgCostPerKwh: ev.last30DaysImpact.avgCostPerKwh,
          co2SavedKg: ev.last30DaysImpact.co2SavedKg,
          batteryCapacityKwh: ev.batteryStorage.capacityKwh,
          batteryCurrentLevelPercent: ev.batteryStorage.currentLevelPercent,
          batteryCurrentLevelKwh: ev.batteryStorage.currentLevelKwh,
          batteryCyclesCompleted: ev.batteryStorage.cyclesCompleted,
          batteryHealthPercent: ev.batteryStorage.healthPercent,
        });

        // 4c. Seed Appliance Sessions
        if (ev.applianceSessions && ev.applianceSessions.length > 0) {
          logger.info(`  🕒 Seeding ${ev.applianceSessions.length} sessions`);
          await db.insert(schema.applianceSessions).values(
            ev.applianceSessions.map((sess: any) => ({
              ...sess,
              locationId: loc.locationId,
            }))
          );
        }
      }

      // 4d. Seed Active Appliances
      if (loc.dashboard.activeAppliances && loc.dashboard.activeAppliances.length > 0) {
        logger.info(`  🔌 Seeding ${loc.dashboard.activeAppliances.length} active appliances`);
        await db.insert(schema.activeAppliances).values(
          loc.dashboard.activeAppliances.map((app: any) => ({
            ...app,
            locationId: loc.locationId,
            startedAt: app.startedAt ? new Date(app.startedAt) : null,
          }))
        );
      }

      // 4e. Seed Load Graphs
      if (loc.loadGraphs) {
        logger.info('  📈 Seeding load graphs (daily/weekly/monthly)');

        const allGraphs: any[] = [];
        const intervals = ['daily', 'weekly', 'monthly'];

        // Refactored to map through intervals dynamically to save lines
        intervals.forEach(interval => {
          if (loc.loadGraphs[interval]) {
            loc.loadGraphs[interval].forEach((g: any) => {
              allGraphs.push({
                ...g,
                locationId: loc.locationId,
                intervalType: interval,
                timestamp: new Date(g.timestamp),
              });
            });
          }
        });

        if (allGraphs.length > 0) {
          await db.insert(schema.loadGraphs).values(allGraphs);
        }
      }

      // 4f. Seed Alerts
      if (loc.alerts && loc.alerts.length > 0) {
        logger.info(`  🔔 Seeding ${loc.alerts.length} alerts for ${loc.locationId}`);
        await db.insert(schema.alerts).values(
          loc.alerts.map((alert: any) => ({
            alertId: alert.alertId,
            locationId: loc.locationId,
            title: alert.title,
            message: alert.message,
            severity: alert.severity,
            category: alert.category,
            timestamp: new Date(alert.timestamp),
            isRead: alert.isRead,
          }))
        );
      }

      // 4g. Seed Current Bill
      if (loc.billing?.currentBill) {
        logger.info(`  💳 Seeding current bill for ${loc.locationId}`);
        const currentBillData = loc.billing.currentBill;
        await db.insert(schema.currentBill).values({
          billId: currentBillData.billId,
          locationId: loc.locationId,
          month: currentBillData.month,
          year: currentBillData.year,
          amountDue: currentBillData.amountDue.toString(),
          dueDate: new Date(currentBillData.dueDate),
          status: currentBillData.status,
          unitsConsumed: currentBillData.unitsConsumed,
          subsidyApplied: currentBillData.subsidyApplied.toString(),
          surcharges: currentBillData.surcharges.toString(),
          ratePerUnit: currentBillData.ratePerUnit,
          generatedOn: new Date(currentBillData.generatedOn),
        });
      }

      // 4h. Seed Billing History
      if (loc.billing?.billingHistory && loc.billing.billingHistory.length > 0) {
        logger.info(`  📊 Seeding ${loc.billing.billingHistory.length} billing history records for ${loc.locationId}`);
        await db.insert(schema.billingHistory).values(
          loc.billing.billingHistory.map((bill: any, index: number) => ({
            billId: `BILL-${loc.locationId}-${bill.month}-${bill.year}`,
            locationId: loc.locationId,
            month: bill.month,
            year: bill.year,
            totalConsumptionKwh: bill.totalConsumptionKwh,
            totalPaidInr: bill.totalPaidInr.toString(),
            status: bill.status,
            paidOn: bill.status === 'PAID' 
              ? new Date(`${bill.year}-${String(bill.month).padStart(2, '0')}-28T23:59:59+05:30`)
              : null,
          }))
        );
      }
    }

    logger.info('✅ Database seeding completed successfully from JSON!');
    process.exit(0);
  } catch (err) {
    logger.error('❌ Seeding failed!');
    logger.error(err);
    process.exit(1);
  }
};

seed();