# Brumes -- Quantum-Aware AI Context Oracle for Web3 Agents

## Project Overview
This project implements a system where AI Agents can communicate using a shared language (Model Context Protocol - MCP), access verifiable random information from a quantum source, and record interactions on a public Web3 ledger.

## Simplified Explanation
Imagine you have a super smart helper (that's the AI part) for things on the internet that use special secret codes (that's the Web3 part).
Now, sometimes these secret codes could be broken by super-duper powerful future computers called "quantum computers."
So, this special helper (the AI) is also "quantum-aware." This means it understands that these super-duper computers might exist one day.
And this helper is like a "context oracle." Think of an oracle as someone who gives wise advice. This helper gives smart advice based on the situation ("context") about these Web3 things, keeping in mind that quantum computers might be able to crack some of the codes in the future.
So, it's like a smart helper for the future of the internet that knows about super-powerful computers!

## System Architecture
The system consists of several key components:
1. **Frontend dApp**: User interface for interacting with the system
2. **MCP Gateway / API Layer**: Central hub for routing messages between components
3. **AI Agent Layer**: Specialized AI agents that process MCP messages
4. **Quantum Backend**: Generates truly random numbers using quantum principles
5. **Blockchain / Smart Contracts**: Provides a transparent and unchangeable public ledger
6. **Decentralized Storage**: Stores detailed MCP context logs permanently

## Project Structure
```
quantum_ai_oracle_project/
├── mcp/                      # Model Context Protocol
│   ├── mcp_schema.json       # JSON schema for MCP
│   ├── example_request.json  # Example MCP request
│   └── example_response.json # Example MCP response
├── gateway/                  # MCP Gateway
│   ├── server.js             # Gateway server implementation
│   ├── test_client.js        # Test client for the gateway
│   └── logs/                 # Directory for gateway logs
├── quantum_backend/          # Quantum Random Number Generator
│   ├── quantum_simulator.js  # Simulated quantum backend
│   └── test_quantum.js       # Test script for quantum backend
├── ai_agent/                 # AI Agent Implementation
│   ├── ai_agent.js           # Basic AI agent implementation
│   ├── test_agent.js         # Test script for AI agent
│   └── agent_response.json   # Example agent response
├── blockchain/               # Blockchain Integration
│   ├── contracts/            # Smart contracts
│   │   └── QuantumOracleRegistry.sol # Main smart contract
│   ├── migrations/           # Truffle migrations
│   └── scripts/              # Utility scripts
├── frontend/                 # Frontend dApp
│   └── index.html            # Web interface
├── storage/                  # Decentralized Storage
│   ├── decentralized_storage.js # Storage implementation
│   ├── test_storage.js       # Test script for storage
│   └── ipfs_storage/         # Simulated IPFS storage
└── todo.md                   # Project checklist
```

## How to Run the Project

### 1. Set up the MCP Gateway
```bash
cd gateway
npm install
node server.js
```
The gateway will start on port 3000.

### 2. Test the Quantum Backend
```bash
cd quantum_backend
node test_quantum.js
```

### 3. Test the AI Agent
```bash
cd ai_agent
node test_agent.js
```

### 4. Deploy the Smart Contract
```bash
cd blockchain
npx truffle develop
migrate
```

### 5. Run the Frontend
Open `frontend/index.html` in a web browser to interact with the system.

### 6. Test the Decentralized Storage
```bash
cd storage
node test_storage.js
```

## Component Details

### Model Context Protocol (MCP)
The MCP defines the structure of "context objects" exchanged between agents and system parts. It includes fields for model information, context details, and output structure.

### MCP Gateway
A web server that receives MCP messages, routes them to appropriate components, and returns responses. It logs all messages for reference.

### Quantum Backend
A simulated quantum random number generator that provides random numbers with metadata about the generation process.

### AI Agent
A basic AI agent that can receive MCP messages, interpret goals, request quantum random numbers, and update the provenance trail.

### Blockchain Integration
A Solidity smart contract that stores session information and quantum random number generation events on the blockchain.

### Frontend dApp
A web interface that allows users to generate quantum random numbers, view session history, and learn about the system.

### Decentralized Storage
A simulated IPFS implementation that stores full MCP context objects and provides content identifiers (CIDs) for retrieval.

## Future Enhancements
1. Replace the simulated quantum backend with a real quantum hardware connection
2. Expand the AI agent capabilities to handle more complex tasks
3. Implement more sophisticated blockchain interactions
4. Add user authentication and permissions
5. Enhance the frontend with more visualizations and interactions

## Conclusion
This project demonstrates how AI agents, quantum randomness, blockchain, and decentralized storage can work together to create a trustworthy and verifiable system for AI interactions.
