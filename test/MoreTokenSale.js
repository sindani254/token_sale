var MoreTokenSale = artifacts.require('./MoreTokenSale.sol');

contract('MoreTokenSale', function(accounts) {

    "use strict";
    var tokenSaleInstance;
    var tokenPrice = 1000000000000000; // in wei

    it('initializes the contract with the correct values', function () {
        return MoreTokenSale.deployed().then(function(instance) {
            tokenSaleInstance = instance;
            return tokenSaleInstance.address
        }).then(function(tokenSaleAddress) {
            assert.notEqual(tokenSaleAddress, 0x0, 'has token sale contract address');
            return tokenSaleInstance.tokenContract();
        }).then(function(tokenAddress) {
            assert.notEqual(tokenAddress, 0x0, 'has token contract address');
            return tokenSaleInstance.tokenPrice();
        }).then(function(price) {
            assert.equal(price, tokenPrice, 'token price is correct');
        });
    });
});