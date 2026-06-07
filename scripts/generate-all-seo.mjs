import fetch from 'node-fetch';

const CATEGORIES = [
  "Restaurants Database",
  "Hotels Database",
  "Hospitals Database",
  "Schools Database",
  "CA Firms Database",
  "Lawyers Database",
  "Manufacturers Database",
  "Exporters Database",
  "Importers Database",
  "IT Companies Database",
  "Startup Database",
  "Business Database",
  "Company Database",
  "SME Database",
  "MSME Database",
  "Business Directory",
  "Local Business Directory",
  "Business Leads",
  "B2B Leads",
  "Verified Business Leads",
  "Company Contact Database",
  "Business Owner Mobile Numbers",
  "CEO Email Database",
  "Decision Maker Database",
  "Company Email Database",
  "Sales Leads",
  "Prospect Database"
];

// Focus on top 10 major Indian cities to keep the batch size reasonable for initial launch
const CITIES = [
  "Mumbai",
  "Delhi",
  "Bangalore",
  "Hyderabad",
  "Ahmedabad",
  "Chennai",
  "Kolkata",
  "Surat",
  "Pune",
  "Jaipur"
];

const ADMIN_SECRET = "UpYlNCq51xp5KYyofoLhap467glWpkMuJERefqAJGQU=";
const API_URL = "https://dhandaleads.com/api/admin/generate-seo-batch";

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  console.log(`Starting SEO batch generation for ${CATEGORIES.length} categories and ${CITIES.length} cities (${CATEGORIES.length * CITIES.length} total pages)...`);
  
  let count = 0;
  for (const city of CITIES) {
    for (const category of CATEGORIES) {
      count++;
      console.log(`[${count}/${CATEGORIES.length * CITIES.length}] Generating: ${category} in ${city}`);
      
      try {
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            categories: [category],
            cities: [city],
            adminSecret: ADMIN_SECRET
          })
        });
        
        const data = await response.json();
        if (data.error) {
          console.error(`  -> Failed (Server Error):`, data.error);
        } else if (data.results && data.results[0]?.status === 'error') {
          console.error(`  -> Failed (API Error):`, data.results[0].reason);
          // If rate limit, wait longer
          if (data.results[0].reason.includes('429')) {
             console.log("  -> Rate limit hit, sleeping for 60 seconds...");
             await sleep(60000);
          }
        } else {
          console.log(`  -> Success:`, data.results?.[0]?.slug);
        }
      } catch (err) {
        console.error(`  -> Failed (Network/Exception):`, err.message);
      }
      
      // Wait 5 seconds between requests to respect 15 RPM free tier limit
      await sleep(5000);
    }
  }
  
  console.log("Finished generating pages.");
}

main();
