// Basic AI Agent for Quantum-Aware AI Context Oracle
const http = require('http');

class AIAgent {
  constructor(id, type, capabilities) {
    this.id = id || 'ai-agent-001';
    this.type = type || 'OracleAgent';
    this.capabilities = capabilities || ['textGeneration', 'quantumRandomness'];
    this.version = '1.0.0';
    this.gatewayUrl = 'http://localhost:3000';
  }

  /**
   * Process an incoming MCP message
   * @param {Object} mcpMessage - The MCP message to process
   * @returns {Promise<Object>} - The processed result
   */
  async processMcpMessage(mcpMessage) {
    console.log(`Agent ${this.id} processing message with goal: ${mcpMessage.contextDetails.taskGoal}`);
    
    // Update the provenance trail
    if (!mcpMessage.contextDetails.provenanceTrail) {
      mcpMessage.contextDetails.provenanceTrail = [];
    }
    
    // Add our processing step to the provenance trail
    mcpMessage.contextDetails.provenanceTrail.push({
      timestamp: new Date().toISOString(),
      agentId: this.id,
      operation: 'receiveMessage',
      result: 'processing',
      hash: this.generateSimpleHash(JSON.stringify(mcpMessage))
    });
    
    // Determine what to do based on the task goal
    if (mcpMessage.contextDetails.taskGoal.toLowerCase().includes('quantum random')) {
      return await this.handleQuantumRandomRequest(mcpMessage);
    } else {
      return this.createBasicResponse(mcpMessage, 'Unknown task goal');
    }
  }
  
  /**
   * Handle a quantum random number request
   * @param {Object} mcpMessage - The MCP message requesting a quantum random number
   * @returns {Promise<Object>} - The response with the quantum random number
   */
  async handleQuantumRandomRequest(mcpMessage) {
    console.log('Handling quantum random number request');
    
    // Extract parameters from the message
    const variables = mcpMessage.contextDetails.environmentState.variables || {};
    const min = variables.min || 0;
    const max = variables.max || 100;
    const format = variables.format || 'integer';
    
    try {
      // Request a quantum random number from the gateway
      const quantumResult = await this.requestQuantumRandom(min, max, format);
      
      // Update the provenance trail
      mcpMessage.contextDetails.provenanceTrail.push({
        timestamp: new Date().toISOString(),
        agentId: this.id,
        operation: 'requestQuantumRandom',
        result: 'success',
        hash: this.generateSimpleHash(JSON.stringify(quantumResult))
      });
      
      // Create the response with the quantum result
      const response = this.createBasicResponse(mcpMessage, 'Quantum random number generated');
      response.result = {
        randomNumber: quantumResult.result,
        timestamp: quantumResult.metadata.timestamp,
        source: quantumResult.metadata.source
      };
      
      return response;
    } catch (error) {
      console.error('Error requesting quantum random number:', error);
      
      // Update the provenance trail with the error
      mcpMessage.contextDetails.provenanceTrail.push({
        timestamp: new Date().toISOString(),
        agentId: this.id,
        operation: 'requestQuantumRandom',
        result: 'error',
        hash: this.generateSimpleHash(error.message)
      });
      
      // Create an error response
      return this.createBasicResponse(mcpMessage, 'Error generating quantum random number');
    }
  }
  
  /**
   * Request a quantum random number from the gateway
   * @param {number} min - Minimum value
   * @param {number} max - Maximum value
   * @param {string} format - Output format
   * @returns {Promise<Object>} - The quantum random number result
   */
  requestQuantumRandom(min, max, format) {
    return new Promise((resolve, reject) => {
      // Prepare the request data
      const requestData = JSON.stringify({
        min: min,
        max: max,
        format: format
      });
      
      // Prepare the HTTP request options
      const options = {
        hostname: 'localhost',
        port: 3000,
        path: '/api/quantum/random',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(requestData)
        }
      };
      
      // Create the request
      const req = http.request(options, (res) => {
        let data = '';
        
        // Collect the response data
        res.on('data', (chunk) => {
          data += chunk;
        });
        
        // Process the complete response
        res.on('end', () => {
          if (res.statusCode === 200) {
            try {
              const response = JSON.parse(data);
              resolve(response.quantumResult);
            } catch (error) {
              reject(new Error('Failed to parse response'));
            }
          } else {
            reject(new Error(`Request failed with status code ${res.statusCode}`));
          }
        });
      });
      
      // Handle request errors
      req.on('error', (error) => {
        reject(error);
      });
      
      // Send the request
      req.write(requestData);
      req.end();
    });
  }
  
  /**
   * Create a basic response MCP message
   * @param {Object} originalMessage - The original MCP message
   * @param {string} message - A message describing the result
   * @returns {Object} - The response MCP message
   */
  createBasicResponse(originalMessage, message) {
    return {
      modelInfo: {
        id: this.id,
        type: this.type,
        capabilities: this.capabilities,
        version: this.version
      },
      contextDetails: {
        taskGoal: originalMessage.contextDetails.taskGoal,
        environmentState: {
          timestamp: new Date().toISOString(),
          sessionId: originalMessage.contextDetails.environmentState.sessionId,
          variables: originalMessage.contextDetails.environmentState.variables
        },
        permissions: originalMessage.contextDetails.permissions,
        provenanceTrail: originalMessage.contextDetails.provenanceTrail
      },
      outputStructure: originalMessage.outputStructure,
      message: message
    };
  }
  
  /**
   * Generate a simple hash for provenance tracking
   * @param {string} input - The input string to hash
   * @returns {string} - A simple hash of the input
   */
  generateSimpleHash(input) {
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      const char = input.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return '0x' + Math.abs(hash).toString(16);
  }
}

module.exports = AIAgent;
