const fetch = require('node-fetch');
const fs = require('fs').promises;

const BATCH_SIZE = 25;
const BASE_URL = 'https://api.ldjam.com/vx/node2/get/';

async function readIds() {
    const data = await fs.readFile('ld-entries.json', 'utf8');
    return JSON.parse(data).ids;
}

function chunkArray(array, size) {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
        chunks.push(array.slice(i, i + size));
    }
    return chunks;
}

async function fetchGameDetails(ids) {
    try {
        const idString = ids.join('+');
        const response = await fetch(`${BASE_URL}${idString}`);
        const data = await response.json();
        return data.node || [];
    } catch (error) {
        console.error('Error fetching game details:', error);
        return [];
    }
}

async function main() {
    try {
        // Read IDs from file
        const allIds = await readIds();
        console.log(`Found ${allIds.length} IDs to process`);

        // Split IDs into chunks of BATCH_SIZE
        const chunks = chunkArray(allIds, BATCH_SIZE);
        console.log(`Split into ${chunks.length} batches of ${BATCH_SIZE}`);

        const allNodes = [];
        
        // Process each chunk
        for (let i = 0; i < chunks.length; i++) {
            console.log(`Processing batch ${i + 1}/${chunks.length}...`);
            const nodes = await fetchGameDetails(chunks[i]);
            allNodes.push(...nodes);
            
            // Add a delay between requests
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Log progress
            console.log(`Retrieved ${nodes.length} games (Total: ${allNodes.length})`);
        }

        // Save all game details to a new file
        await fs.writeFile(
            'game-details.json',
            JSON.stringify({ games: allNodes }, null, 2)
        );
        console.log(`Successfully saved ${allNodes.length} games to game-details.json`);

    } catch (error) {
        console.error('Error in main process:', error);
    }
}

main(); 