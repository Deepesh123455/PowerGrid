// tests/chat.sanity.ts

const API_URL = 'http://127.0.0.1:3000/api/v1/chat';

interface ApiResponse {
    reply?: string;
    error?: string;
}

const runTests = async () => {
    console.log('🧪 Starting Energy Concierge Sanity Tests...\n');

    const testCases = [
        {
            name: '✅ Valid Energy Query (Should hit 70B Model)',
            payload: { message: "My AC is running all day and my bill is 4000 rupees. How can I reduce it?" },
            expectedStatus: 200
        },
        {
            name: '🛡️ Out of Scope Query (Gatekeeper should block)',
            payload: { message: "Can you write a python script to scrape a website?" },
            expectedStatus: 200
        },
        {
            name: '❌ Invalid Payload (Should return 400)',
            payload: { wrongKey: "Hello" },
            expectedStatus: 400
        }
    ];

    for (const test of testCases) {
        console.log(`▶️  Running: ${test.name}`);
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(test.payload)
            });

            // Added type assertion here to fix the 'unknown' error
            const data = (await response.json()) as ApiResponse;
            
            if (response.status === test.expectedStatus) {
                console.log(`   Status: [PASS] ${response.status}`);
                console.log(`   Response: \x1b[32m${data.reply || data.error}\x1b[0m\n`); 
            } else {
                console.log(`   Status: [FAIL] Expected ${test.expectedStatus}, got ${response.status}`);
                console.log(`   Response: \x1b[31m${JSON.stringify(data)}\x1b[0m\n`);
            }

        } catch (error) {
            console.error(`   [ERROR] Failed to reach server. Is it running?`, error, '\n');
        }
    }

    console.log('🏁 Tests completed.');
};

runTests();