// Update the server.js file to integrate with the quantum simulator
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const QuantumSimulator = require('../quantum_backend/quantum_simulator');
const app = express();
const PORT = 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Simple logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Endpoint to receive MCP messages
app.post('/api/mcp', (req, res) => {
  const mcpMessage = req.body;
  
  // Log the received message
  console.log('Received MCP message:');
  console.log(JSON.stringify(mcpMessage, null, 2));
  
  // Save the message to a file for reference
  const timestamp = new Date().toISOString().replace(/:/g, '-');
  const filename = `mcp_message_${timestamp}.json`;
  fs.writeFileSync(
    path.join(__dirname, 'logs', filename),
    JSON.stringify(mcpMessage, null, 2)
  );
  
  // Check if this is a quantum random number request
  if (mcpMessage.contextDetails && 
      mcpMessage.contextDetails.taskGoal === "Generate a quantum random number") {
    
    // Extract parameters from the message
    const variables = mcpMessage.contextDetails.environmentState.variables || {};
    const min = variables.min || 0;
    const max = variables.max || 100;
    const format = variables.format || 'integer';
    
    // Generate the quantum random number
    const quantumResult = QuantumSimulator.generateRandomNumber(min, max, format);
    
    // Create a response with the quantum result
    const response = {
      status: 'success',
      message: 'Quantum random number generated',
      timestamp: new Date().toISOString(),
      requestId: `req-${Date.now()}`,
      quantumResult: quantumResult
    };
    
    res.json(response);
  } else {
    // For other types of messages, send a simple acknowledgment
    res.json({
      status: 'success',
      message: 'MCP message received',
      timestamp: new Date().toISOString(),
      requestId: `req-${Date.now()}`
    });
  }
});

// New endpoint specifically for quantum random number generation
app.post('/api/quantum/random', (req, res) => {
  const { min = 0, max = 100, format = 'integer' } = req.body;
  
  // Generate the quantum random number
  const quantumResult = QuantumSimulator.generateRandomNumber(min, max, format);
  
  // Send the result
  res.json({
    status: 'success',
    message: 'Quantum random number generated',
    timestamp: new Date().toISOString(),
    quantumResult: quantumResult
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`MCP Gateway listening on port ${PORT}`);
  console.log(`Server started at ${new Date().toISOString()}`);
});
