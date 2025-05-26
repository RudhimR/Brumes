// Test script for the decentralized storage
const DecentralizedStorage = require('./decentralized_storage');
const fs = require('fs');
const path = require('path');

// Create an instance of the decentralized storage
const storage = new DecentralizedStorage();

// Example MCP context object to store
const mcpContext = {
  "modelInfo": {
    "id": "quantum-agent-001",
    "type": "QuantumAgent",
    "capabilities": ["quantumRandomness"],
    "version": "1.0.0"
  },
  "contextDetails": {
    "taskGoal": "Generate a quantum random number",
    "environmentState": {
      "timestamp": "2025-05-25T09:56:00Z",
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
    "provenanceTrail": [
      {
        "timestamp": "2025-05-25T09:56:00Z",
        "agentId": "web-agent-001",
        "operation": "requestQuantumRandom",
        "result": "request_sent",
        "hash": "0x123abc456def"
      },
      {
        "timestamp": "2025-05-25T09:56:10Z",
        "agentId": "quantum-agent-001",
        "operation": "generateQuantumRandom",
        "result": "success",
        "hash": "0x789ghi101jkl"
      }
    ]
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
  },
  "result": {
    "randomNumber": 42,
    "timestamp": "2025-05-25T09:56:10Z",
    "source": "quantum_simulator"
  }
};

// Test storing and retrieving the MCP context
async function testStorage() {
  try {
    console.log('Testing decentralized storage...');
    
    // Store the MCP context
    console.log('Storing MCP context...');
    const cid = await storage.storeMCPContext(mcpContext);
    console.log(`MCP context stored with CID: ${cid}`);
    
    // Retrieve the MCP context
    console.log('Retrieving MCP context...');
    const retrievedContext = await storage.retrieveMCPContext(cid);
    console.log('Retrieved MCP context:');
    console.log(JSON.stringify(retrievedContext, null, 2));
    
    // Verify the retrieved context matches the original
    const isEqual = JSON.stringify(mcpContext) === JSON.stringify(retrievedContext);
    console.log(`Verification result: ${isEqual ? 'Success' : 'Failure'}`);
    
    // Save the test results
    const resultPath = path.join(__dirname, 'storage_test_result.json');
    fs.writeFileSync(resultPath, JSON.stringify({
      original: mcpContext,
      cid: cid,
      retrieved: retrievedContext,
      verified: isEqual
    }, null, 2));
    
    console.log(`Test results saved to ${resultPath}`);
    
    return { success: true, cid };
  } catch (error) {
    console.error('Error testing storage:', error);
    return { success: false, error: error.message };
  }
}

// Run the test
testStorage()
  .then(result => {
    if (result.success) {
      console.log('Storage test completed successfully');
    } else {
      console.error('Storage test failed:', result.error);
    }
  })
  .catch(error => {
    console.error('Unexpected error during test:', error);
  });
