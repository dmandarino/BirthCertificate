var BirthCertificate = artifacts.require("./BirthCertificate.sol");

module.exports = function(deployer) {
  deployer.deploy(BirthCertificate);
};
