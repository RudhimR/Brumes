// Test script to send an MCP message to the gateway
const http = require('http');

// Example MCP request from our schema
const mcpRequest = {
  "modelInfo": {
    "id": "web-agent-001",
    "type": "WebAgent",
    "capabilities": ["webAccess", "quantumRandomness"],
    "version": "1.0.0"
  },
  "contextDetails": {
    "taskGoal": "Generate a quantum random number",
    "environmentState": {
      "timestamp": "2025-05-25T09:45:00Z",
      "sessionId": "session-123456",
      "variables": {
        "min": 1,
        "max": 100,
        "format": "integer"
      }
    },
    "permissions": {
      "dataAccess": ["quantumRandom"],
      "operations": ["generateRandom", "readOnly"]
    },
    "provenanceTrail": []
  },
  "outputStructure": {
    "format": "json",
    "schema": {
      "type": "object",
      "properties": {
        "randomNumber": {
          "type": "integer"
        },
        "timestamp": {
          "type": "string",
          "format": "date-time"
        },
        "source": {
          "type": "string"
        }
      }
    },
    "destination": "user"
  }
};

// Options for the HTTP request
const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/mcp',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(JSON.stringify(mcpRequest))
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
req.write(JSON.stringify(mcpRequest));
req.end();

console.log('Test request sent to MCP Gateway');
