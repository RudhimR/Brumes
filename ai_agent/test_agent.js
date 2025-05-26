// Test script for the AI Agent
const AIAgent = require('./ai_agent');
const fs = require('fs');
const path = require('path');

// Create an instance of the AI Agent
const agent = new AIAgent('test-agent-001', 'OracleAgent', ['textGeneration', 'quantumRandomness']);

// Load the example MCP request from our schema
const mcpRequestPath = path.join(__dirname, '..', 'mcp', 'example_request.json');
const mcpRequest = JSON.parse(fs.readFileSync(mcpRequestPath, 'utf8'));

console.log('Testing AI Agent with MCP request...');

// Process the MCP message
agent.processMcpMessage(mcpRequest)
  .then(response => {
    console.log('AI Agent response:');
    console.log(JSON.stringify(response, null, 2));
    
    // Save the response to a file
    const responsePath = path.join(__dirname, 'agent_response.json');
    fs.writeFileSync(responsePath, JSON.stringify(response, null, 2));
    console.log(`Response saved to ${responsePath}`);
  })
  .catch(error => {
    console.error('Error processing MCP message:', error);
  });
