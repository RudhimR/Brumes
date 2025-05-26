// Test script for the quantum random number generation
const http = require('http');

// Request for quantum random number
const quantumRequest = {
  min: 1,
  max: 100,
  format: 'integer'
};

// Options for the HTTP request
const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/quantum/random',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(JSON.stringify(quantumRequest))
  }
};

// Create the request
const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
  res.setEncoding('utf8');
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Response body:', data);
  });
});

// Handle errors
req.on('error', (e) => {
  console.error(`Problem with request: ${e.message}`);
});

// Write data to request body
req.write(JSON.stringify(quantumRequest));
req.end();

console.log('Test request sent to Quantum Random Number Generator');
