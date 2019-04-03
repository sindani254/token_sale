const MoreToken = artifacts.require("MoreToken");

module.exports = function(deployer) {
  	deployer.deploy(MoreToken, 1000000);
};
