import axios from 'axios';

const TEST_MESSAGES = [
  "Hello!",
  "Can you help me reduce my AC electricity consumption?",
  "What is the best way to cook pasta?",
];

async function runTests() {
  console.log('🚀 Starting Chatbot API Tests...\n');

  for (const msg of TEST_MESSAGES) {
    console.log(`User: ${msg}`);
    try {
      const response = await axios.post('http://localhost:3000/api/v1/chat', { message: msg });
      console.log(`Bot: ${response.data.reply}`);
    } catch (error: any) {
      console.error(`Error: ${error.response?.data?.error || error.message}`);
    }
    console.log('-------------------\n');
  }
}

runTests();
