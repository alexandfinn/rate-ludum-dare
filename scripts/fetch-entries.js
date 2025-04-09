const fetch = require('node-fetch');
const fs = require('fs').promises;

const BASE_URL = 'https://api.ldjam.com/vx/node/feed/406845/smart+parent/item/game/jam';
const LIMIT = 250;

async function fetchAllEntries() {
    let offset = 0;
    let allIds = [];
    let hasMore = true;

    while (hasMore) {
        try {
            console.log(`Fetching entries with offset ${offset}...`);
            const response = await fetch(`${BASE_URL}?limit=${LIMIT}&offset=${offset}`);
            const data = await response.json();

            if (!data.feed || data.feed.length === 0) {
                hasMore = false;
                continue;
            }

            const ids = data.feed.map(entry => entry.id);
            allIds = allIds.concat(ids);
            console.log(`Found ${ids.length} entries`);

            offset += LIMIT;

            // Add a small delay to avoid overwhelming the API
            await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
            console.error('Error fetching entries:', error);
            hasMore = false;
        }
    }

    return allIds;
}

async function main() {
    try {
        const allIds = await fetchAllEntries();
        console.log(`Total entries found: ${allIds.length}`);
        
        // Save to JSON file
        await fs.writeFile('ld-entries.json', JSON.stringify({ ids: allIds }, null, 2));
        console.log('Results saved to ld-entries.json');
    } catch (error) {
        console.error('Error in main process:', error);
    }
}

main(); 