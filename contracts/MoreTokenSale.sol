pragma solidity ^0.5.0;

import "./MoreToken.sol";

contract MoreTokenSale {

	address admin;
	MoreToken public tokenContract;
	uint256 public tokenPrice;

	constructor (MoreToken _tokenContract, uint256 _tokenPrice) public {

		// assign an admin
		admin = msg.sender;

		// assign a token contract
		tokenContract = _tokenContract;

		// assign token price
		tokenPrice = _tokenPrice;
	}
} 