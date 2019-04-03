pragma solidity ^0.5.0;

contract MoreToken {

	string public name = "More Token";
	string public symbol = "MORE";
	string public standard = "More Token v1.0"; 
	uint256 public totalSupply; // set the total no. of tokens

	event Transfer(
		address indexed _from,
		address indexed _to,
		uint256 _value
	);

	event Approval(
		address indexed _owner,
		address indexed _spender,
		uint256 _value
	);
	

	mapping(address => uint256) public balanceOf;
	mapping(address => mapping(address => uint256)) public allowance;   

	// constructor
	constructor (uint256 _initialSupply) public {
		balanceOf[msg.sender] = _initialSupply;
		totalSupply = _initialSupply;
	}

	// transfer token ownership function
	function transfer (address _to, uint256 _value) public returns(bool success) {
		// raise an exception if sender's a/c doesn't have sufficient funds
		require (balanceOf[msg.sender] >= _value);
		
		balanceOf[msg.sender] -= _value;
		balanceOf[_to] += _value;

		// trigger transfer event
		emit Transfer(msg.sender, _to, _value);

		return true;
	}
	
	// approve
	function approve(address _spender, uint256 _value) public returns(bool success) {
		
		allowance[msg.sender][_spender] = _value;
		// trigger the Approval event
		emit Approval(msg.sender, _spender, _value);

		return true;
	}

	function transferFrom(address _from, address _to, uint256 _value) public returns(bool success) {

		// require that the transfer amount <= sender's balance
		require (_value <= balanceOf[_from]);
		
		// require that the transfer amount <= the approved amount
		require (allowance[_from][msg.sender] >= _value);

		// trigger the Transfer event
		emit Transfer(_from, _to, _value);

		// update sender's balance
		balanceOf[_from] -= _value;

		// update receiver's balance
		balanceOf[_to] += _value;

		// update the allowance
		allowance[_from][msg.sender] -= _value;

		return true;
	}

}