var MoreToken = artifacts.require("./MoreToken.sol");
var MoreTokenSale = artifacts.require("./MoreTokenSale.sol");

module.exports = function (deployer) {
    'use strict';
    deployer.deploy(MoreToken, 1000000).then(function () {
        var tokenPrice = 1000000000000000; // in wei
        return deployer.deploy(MoreTokenSale, MoreToken.address, tokenPrice);
    });
};
