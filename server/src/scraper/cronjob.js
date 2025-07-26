import { readdirSync } from 'fs';
import { join } from 'path';
import { pathToFileURL } from 'url';
import Event from '../models/event.models.js'; // your Event model

async function syncEvents(scrapedEvents) {
  // 🧹 Skip invalid dates
  scrapedEvents = scrapedEvents.filter(ev => ev.date instanceof Date && !isNaN(ev.date));

  const scrapedKeys = scrapedEvents.map(ev => `${ev.title}|${ev.date.toISOString()}`);

  const existingEvents = await Event.find({
    $or: scrapedEvents.map(ev => ({ title: ev.title, date: ev.date }))
  });

  const existingKeysSet = new Set(existingEvents.map(ev => `${ev.title}|${ev.date.toISOString()}`));

  for (const ev of scrapedEvents) {
    const key = `${ev.title}|${ev.date.toISOString()}`;
    if (!existingKeysSet.has(key)) {
      await Event.create(ev);
      console.log(`Added new event: ${ev.title}`);
    }
  }

  const scrapedKeysSet = new Set(scrapedKeys);
  const toRemove = existingEvents.filter(ev => !scrapedKeysSet.has(`${ev.title}|${ev.date.toISOString()}`));

  for (const ev of toRemove) {
    await Event.deleteOne({ _id: ev._id });
    console.log(`Removed old event: ${ev.title}`);
  }
}

async function runScraper() {
  const scraperDir = join(process.cwd(), 'src/scraper/scrapers');
  const files = readdirSync(scraperDir).filter(f => f.endsWith('.js'));

  for (const file of files) {
    const scraperPath = join(scraperDir, file);
    try {
      const { default: scraper } = await import(pathToFileURL(scraperPath));
      console.log(`🟢 Running ${file}`);

      const results = await scraper();
      console.log(`✅ Finished ${file} with ${results.length} entries`);

      await syncEvents(results);
    } catch (err) {
      console.error(`❌ Error in ${file}:`, err);
    }
  }
}

export async function startLoop() {
  console.log(`[${new Date().toISOString()}] 🔄 Starting scraper loop`);

  try {
    await runScraper();
    console.log(`[${new Date().toISOString()}] ✅ Scraper completed`);
  } catch (err) {
    console.error(`[${new Date().toISOString()}] ❌ Scraper error`, err);
  }

  const ONE_HOUR = 60 * 60 * 1000; // 3600000ms
  setTimeout(startLoop, ONE_HOUR); // Schedule next run
}

export default startLoop;