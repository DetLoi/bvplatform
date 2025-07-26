import puppeteer from 'puppeteer';
const cheerio = await import('cheerio');
import { parse } from 'date-fns';

function parseEventDate(dateText) {
  const currentYear = new Date().getFullYear();

  // Insert space before "tomorrow" or "in X days" if glued without space
  let cleaned = dateText
    .replace(/(tomorrow|today|in \d+ days)/i, match => ' ' + match)  // insert leading space if missing
    .replace(/in \d+ days/i, '')       // then remove trailing "in 5 days"
    .replace(/\btomorrow\b/i, '')      // remove "tomorrow"
    .replace(/\btoday\b/i, '')         // remove "today"
    .replace(/–|—/g, '-')              // normalize dashes
    .replace(/\s+/g, ' ')              // normalize whitespace
    .trim();

  // Remove suffixes like "st", "nd", "rd", "th"
  cleaned = cleaned.replace(/(\d{1,2})(st|nd|rd|th)/gi, '$1');

  let startDate = null;
  let endDate = null;

  // Now your existing regex parsing logic here:
  let match = cleaned.match(/^([A-Za-z]{3,9}) (\d{1,2}) - ([A-Za-z]{3,9}) (\d{1,2})(?: (\d{4}))?$/);
  if (match) {
    const [, month1, day1, month2, day2, year] = match;
    const y = year || currentYear;
    startDate = parse(`${month1} ${day1} ${y}`, 'MMM d yyyy', new Date());
    endDate = parse(`${month2} ${day2} ${y}`, 'MMM d yyyy', new Date());
    return { startDate, endDate };
  }

  match = cleaned.match(/^([A-Za-z]{3,9}) (\d{1,2}) - (\d{1,2})(?: (\d{4}))?$/);
  if (match) {
    const [, month, day1, day2, year] = match;
    const y = year || currentYear;
    startDate = parse(`${month} ${day1} ${y}`, 'MMM d yyyy', new Date());
    endDate = parse(`${month} ${day2} ${y}`, 'MMM d yyyy', new Date());
    return { startDate, endDate };
  }

  match = cleaned.match(/^([A-Za-z]{3,9}) (\d{1,2})(?: (\d{4}))?$/);
  if (match) {
    const [, month, day, year] = match;
    const y = year || currentYear;
    startDate = parse(`${month} ${day} ${y}`, 'MMM d yyyy', new Date());
    return { startDate, endDate: null };
  }

  console.warn(`❓ Unhandled date format: ${dateText}`);
  return { startDate: null, endDate: null };
}

export default async function scrapeAnd8() {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.goto('https://and8.dance/en/events/', { waitUntil: 'domcontentloaded' });

  const html = await page.content();
  const $ = cheerio.load(html.default || html);
  const events = [];

  $('tr.d_list').each((i, el) => {
    const dateText = $(el).find('td.dateRange').text().trim();
    const anchor = $(el).find('td:nth-child(2) a');
    const title = anchor.text().trim();
    const href = anchor.attr('href');
    const website = href?.startsWith('http') ? href : 'https://and8.dance/' + href;

    const fullText = $(el).find('td:nth-child(2)').text().trim();
    const categoryRaw = fullText.replace(title, '').trim();
    const venue = $(el).find('td:nth-child(3)').text().trim();
    const countryFlag = $(el).find('td:nth-child(3) img');
    const countryName = countryFlag.attr('title') || 'Unknown';

    const category = ['Workshop', 'Competition', 'Jam', 'Battle', 'Showcase'].includes(categoryRaw)
      ? categoryRaw
      : 'Workshop';

    const dateParsed = parseEventDate(dateText);
    if (!dateParsed) return;

    const { startDate: date, endDate } = dateParsed;

    events.push({
        title,               // from scraper (event name)
        description: '',     // NOT available in scraper, set empty string
        category,            // from scraper (mapped category or default)
        status: 'upcoming',  // NOT scraped, set default
        date,                // parsed start date (Date object)
        endDate,             // parsed end date if range, else null
        location: venue,     // from scraper (venue/location)
        image: null,         // NOT available, set null
        website,             // from scraper (event URL)
        organizer: countryName, // from scraper (country or fallback string)
        participants: [],    // NOT available, set empty array
        maxParticipants: null, // NOT available, set null
        price: 0,            // NOT available, default 0
        currency: 'USD',     // NOT available, default 'USD'
        tags: [],            // NOT available, set empty array
        isActive: true,      // NOT available, default true
        });
  });

  await browser.close();
  return events;
}