const QuantumOracleRegistry = artifacts.require("QuantumOracleRegistry");

module.exports = function(deployer) {
  deployer.deploy(QuantumOracleRegistry);
};
