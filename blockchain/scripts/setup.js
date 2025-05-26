// Move the Solidity contract to the contracts directory
const fs = require('fs');
const path = require('path');

// Source and destination paths
const sourcePath = path.join(__dirname, '..', 'QuantumOracleRegistry.sol');
const destPath = path.join(__dirname, '..', 'contracts', 'QuantumOracleRegistry.sol');

// Copy the file
try {
  // Check if source file exists
  if (!fs.existsSync(sourcePath)) {
    console.log(`Source file not found at ${sourcePath}`);
    console.log('Copying directly from original location...');
    
    // Copy from the original location instead
    const originalPath = path.join(__dirname, '..', '..', 'blockchain', 'QuantumOracleRegistry.sol');
    if (fs.existsSync(originalPath)) {
      fs.copyFileSync(originalPath, destPath);
      console.log(`Contract copied from original location to ${destPath}`);
    } else {
      console.log(`Original file not found at ${originalPath}`);
      // Write the contract directly to the destination
      console.log('Writing contract directly to destination...');
      const contractContent = fs.readFileSync(originalPath, 'utf8');
      fs.writeFileSync(destPath, contractContent);
      console.log(`Contract written directly to ${destPath}`);
    }
  } else {
    fs.copyFileSync(sourcePath, destPath);
    console.log(`Contract copied to ${destPath}`);
  }
} catch (error) {
  console.error('Error copying contract:', error);
  console.log('Writing contract directly to destination...');
  
  // Get the contract content from the original file
  const contractPath = '/home/ubuntu/quantum_ai_oracle_project/blockchain/QuantumOracleRegistry.sol';
  if (fs.existsSync(contractPath)) {
    const contractContent = fs.readFileSync(contractPath, 'utf8');
    fs.writeFileSync(destPath, contractContent);
    console.log(`Contract written directly to ${destPath}`);
  } else {
    console.error('Could not find contract file to copy');
  }
}

// Create a migration file for the contract
const migrationContent = `
const QuantumOracleRegistry = artifacts.require("QuantumOracleRegistry");

module.exports = function(deployer) {
  deployer.deploy(QuantumOracleRegistry);
};
`;

// Write the migration file
const migrationPath = path.join(__dirname, '..', 'migrations', '2_deploy_contracts.js');
fs.writeFileSync(migrationPath, migrationContent);
console.log(`Migration file created at ${migrationPath}`);
