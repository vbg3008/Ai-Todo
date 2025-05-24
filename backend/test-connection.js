#!/usr/bin/env node

/**
 * Simple script to test backend connectivity
 * Usage: node test-connection.js [port]
 */

import http from 'http';

const PORT = process.argv[2] || process.env.PORT || 5000;
const HOST = 'localhost';

console.log(`🔍 Testing backend connection on http://${HOST}:${PORT}`);
console.log('─'.repeat(50));

// Test basic connectivity
const testEndpoint = (path, description) => {
  return new Promise((resolve) => {
    const options = {
      hostname: HOST,
      port: PORT,
      path: path,
      method: 'GET',
      timeout: 5000
    };

    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        const status = res.statusCode === 200 ? '✅' : '❌';
        console.log(`${status} ${description}`);
        console.log(`   Status: ${res.statusCode}`);
        
        if (res.headers['content-type']?.includes('application/json')) {
          try {
            const jsonData = JSON.parse(data);
            console.log(`   Response: ${JSON.stringify(jsonData, null, 2)}`);
          } catch (e) {
            console.log(`   Response: ${data.substring(0, 100)}...`);
          }
        } else {
          console.log(`   Response: ${data.substring(0, 100)}...`);
        }
        console.log('');
        resolve({ success: res.statusCode === 200, status: res.statusCode });
      });
    });

    req.on('error', (err) => {
      console.log(`❌ ${description}`);
      console.log(`   Error: ${err.message}`);
      console.log('');
      resolve({ success: false, error: err.message });
    });

    req.on('timeout', () => {
      console.log(`❌ ${description}`);
      console.log(`   Error: Request timeout`);
      console.log('');
      req.destroy();
      resolve({ success: false, error: 'timeout' });
    });

    req.end();
  });
};

// Run tests
async function runTests() {
  const tests = [
    { path: '/', description: 'Root endpoint (/)' },
    { path: '/health', description: 'Health check (/health)' },
    { path: '/api/health', description: 'API health check (/api/health)' },
    { path: '/api/todos', description: 'Todos endpoint (/api/todos)' }
  ];

  let passedTests = 0;
  
  for (const test of tests) {
    const result = await testEndpoint(test.path, test.description);
    if (result.success) passedTests++;
  }

  console.log('─'.repeat(50));
  console.log(`📊 Test Results: ${passedTests}/${tests.length} tests passed`);
  
  if (passedTests === tests.length) {
    console.log('🎉 Backend is running and all endpoints are accessible!');
    process.exit(0);
  } else {
    console.log('⚠️  Some tests failed. Check if the backend server is running.');
    console.log(`💡 Try running: cd backend && npm run dev`);
    process.exit(1);
  }
}

runTests().catch(console.error);
