// Solidity Smart Contract for Quantum-Aware AI Context Oracle
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract QuantumOracleRegistry {
    // Structure to store quantum random number generation events
    struct QuantumEvent {
        string sessionId;
        uint256 timestamp;
        uint256 randomNumber;
        string source;
        bytes32 provenanceHash;
    }
    
    // Structure to store MCP session information
    struct MCPSession {
        string sessionId;
        address requester;
        uint256 createdAt;
        string taskGoal;
        bytes32 contextHash;
        bool isComplete;
    }
    
    // Mapping from session ID to quantum events
    mapping(string => QuantumEvent[]) public quantumEvents;
    
    // Mapping from session ID to MCP session
    mapping(string => MCPSession) public mcpSessions;
    
    // Array to store all session IDs
    string[] public allSessionIds;
    
    // Event emitted when a new quantum random number is generated
    event QuantumRandomGenerated(
        string indexed sessionId,
        uint256 timestamp,
        uint256 randomNumber,
        string source
    );
    
    // Event emitted when a new MCP session is created
    event MCPSessionCreated(
        string indexed sessionId,
        address requester,
        string taskGoal
    );
    
    // Event emitted when an MCP session is completed
    event MCPSessionCompleted(
        string indexed sessionId,
        bytes32 finalContextHash
    );
    
    /**
     * Create a new MCP session
     * @param sessionId Unique identifier for the session
     * @param taskGoal Description of the task goal
     * @param contextHash Hash of the initial MCP context
     */
    function createMCPSession(
        string memory sessionId,
        string memory taskGoal,
        bytes32 contextHash
    ) public {
        // Ensure session doesn't already exist
        require(mcpSessions[sessionId].createdAt == 0, "Session already exists");
        
        // Create new session
        mcpSessions[sessionId] = MCPSession({
            sessionId: sessionId,
            requester: msg.sender,
            createdAt: block.timestamp,
            taskGoal: taskGoal,
            contextHash: contextHash,
            isComplete: false
        });
        
        // Add to list of all sessions
        allSessionIds.push(sessionId);
        
        // Emit event
        emit MCPSessionCreated(sessionId, msg.sender, taskGoal);
    }
    
    /**
     * Record a quantum random number generation event
     * @param sessionId Session ID this event belongs to
     * @param randomNumber The generated random number
     * @param source Source of the random number (e.g., "quantum_simulator")
     * @param provenanceHash Hash of the provenance trail for verification
     */
    function recordQuantumRandom(
        string memory sessionId,
        uint256 randomNumber,
        string memory source,
        bytes32 provenanceHash
    ) public {
        // Ensure session exists
        require(mcpSessions[sessionId].createdAt > 0, "Session does not exist");
        
        // Create new quantum event
        QuantumEvent memory newEvent = QuantumEvent({
            sessionId: sessionId,
            timestamp: block.timestamp,
            randomNumber: randomNumber,
            source: source,
            provenanceHash: provenanceHash
        });
        
        // Add to events for this session
        quantumEvents[sessionId].push(newEvent);
        
        // Emit event
        emit QuantumRandomGenerated(sessionId, block.timestamp, randomNumber, source);
    }
    
    /**
     * Complete an MCP session
     * @param sessionId Session ID to complete
     * @param finalContextHash Hash of the final MCP context
     */
    function completeMCPSession(
        string memory sessionId,
        bytes32 finalContextHash
    ) public {
        // Ensure session exists and is not already complete
        require(mcpSessions[sessionId].createdAt > 0, "Session does not exist");
        require(!mcpSessions[sessionId].isComplete, "Session already completed");
        
        // Update session
        mcpSessions[sessionId].isComplete = true;
        mcpSessions[sessionId].contextHash = finalContextHash;
        
        // Emit event
        emit MCPSessionCompleted(sessionId, finalContextHash);
    }
    
    /**
     * Get the number of quantum events for a session
     * @param sessionId Session ID to query
     * @return Number of quantum events
     */
    function getQuantumEventCount(string memory sessionId) public view returns (uint256) {
        return quantumEvents[sessionId].length;
    }
    
    /**
     * Get the total number of sessions
     * @return Number of sessions
     */
    function getSessionCount() public view returns (uint256) {
        return allSessionIds.length;
    }
}
