var MoreToken = artifacts.require("./MoreToken.sol");

contract('MoreToken', function(accounts) {
	var tokenInstance;

	it('initializes the contract with its correct values', function() {
		return MoreToken.deployed().then(function(instance) {
			tokenInstance = instance;
			return tokenInstance.name();
		}).then(function(name) {
			assert.equal(name, 'More Token', 'has the correct name');
			return tokenInstance.symbol();
		}).then(function(symbol) {
			assert.equal(symbol, 'MORE', 'has correct symbol');
			return tokenInstance.standard();
		}).then(function(standard) {
			assert.equal(standard, 'More Token v1.0', 'has correct standard')
		});
	})

	it('sets the total supply upon deployment', function() {
		return MoreToken.deployed().then(function(instance) {
			tokenInstance = instance;
			return tokenInstance.totalSupply();
		}).then(function(totalSupply) {
			assert.equal(totalSupply.toNumber(), 1000000, 'sets the total supply to 1,000,000');
			return tokenInstance.balanceOf(accounts[0]);
		}).then(function(adminBalance) {
			assert.equal(adminBalance.toNumber(), 1000000, 'allocates the initial supply to the admin a/c')
		});
	});

	it('transfers token ownership', function() {
		return MoreToken.deployed().then(function(instance) {
			tokenInstance = instance;
			// test `require` statement first by transfering a value larger than the sender's balance
			return tokenInstance.transfer.call(accounts[1], 1000001);
		}).then(assert.fail).catch(function(error) {
			assert(error.message.indexOf('revert') >= 0, 'error msg must contain revert');
			return tokenInstance.transfer.call(accounts[1], 250000, { from: accounts[0] });
		}).then(function(success) {
			assert.equal(success, true, 'returns true');
			return tokenInstance.transfer(accounts[1], 250000, { from: accounts[0] });
		}).then(function(receipt) {
			assert.equal(receipt.logs.length, 1, 'triggers 1 event');
			assert.equal(receipt.logs[0].event, 'Transfer', 'should be the `Transfer` event');
			assert.equal(receipt.logs[0].args._from, accounts[0], 'logs the sender`s account');
			assert.equal(receipt.logs[0].args._to, accounts[1], 'logs the receiver`s account');
			assert.equal(receipt.logs[0].args._value, 250000, 'logs the transfer amount');
			return tokenInstance.balanceOf(accounts[1]);
		}).then(function(receiver_bal) {
			assert.equal(receiver_bal.toNumber(), 250000, 'adds amt to receiving a/c');
			return tokenInstance.balanceOf(accounts[0]);
		}).then(function(sender_bal) {
			assert.equal(sender_bal.toNumber(), 750000, 'deducts amt from sending a/c')
		});
	});

	it('approves tokens for delegated transfer', function() {
		return MoreToken.deployed().then(function(instance) {
			tokenInstance = instance;
			return tokenInstance.approve.call(accounts[1], 100);
		}).then(function(success) {
			assert.equal(success, true, 'it returns true');
			return tokenInstance.approve(accounts[1], 100, { from: accounts[0] });
		}).then(function(receipt) {
			assert.equal(receipt.logs.length, 1, 'triggers 1 event');
			assert.equal(receipt.logs[0].event, 'Approval', 'triggers the `Approval` event');
			assert.equal(receipt.logs[0].args._owner, accounts[0], 'logs admin account');
			assert.equal(receipt.logs[0].args._spender, accounts[1], 'logs spender`s account');
			assert.equal(receipt.logs[0].args._value, 100, 'logs the approved amount');
			return tokenInstance.allowance(accounts[0], accounts[1]);
		}).then(function(allowance) {
			assert.equal(allowance.toNumber(), 100, 'stores allowance for delegated transfer');
		});
	});

	it('handles delegated transfers', function() {
		return MoreToken.deployed().then(function(instance) {
			tokenInstance = instance;
			fromAccount = accounts[2];
			toAccount = accounts[3];
			spendingAccount = accounts[4];

			// transfer some tokens to fromAccount
			tokenInstance.transfer(fromAccount, 100, { from: accounts[0] });
		}).then(function(receipt) {

			// approve spendingAccount to spend 10 tokens from fromAccount
			return tokenInstance.approve(spendingAccount, 10, { from: fromAccount });
		}).then(function(receipt) {

			// try transfering a value larger than the sender's balance
			return tokenInstance.transferFrom(fromAccount, toAccount, 101, { from: spendingAccount });
		}).then(assert.fail).catch(function(error) {
			assert(error.message.indexOf('revert') >= 0, 'cannot transfer, insufficient balance');

			// try transfering a value larger than the approved amount
			return tokenInstance.transferFrom(fromAccount, toAccount, 11, { from: spendingAccount });
		}).then(assert.fail).catch(function(error) {
			assert(error.message.indexOf('revert') >= 0, 'transfer value not approved');
			return tokenInstance.transferFrom.call(fromAccount, toAccount, 10, { from: spendingAccount });
		}).then(function(success) {
			assert.equal(success, true, 'returns true');
			return tokenInstance.transferFrom(fromAccount, toAccount, 10, { from: spendingAccount });
		}).then(function(receipt) {
			assert.equal(receipt.logs.length, 1, 'triggers 1 event');
			assert.equal(receipt.logs[0].event, 'Transfer', 'triggers the `Transfer` event');
			assert.equal(receipt.logs[0].args._from, fromAccount, 'logs sender account');
			assert.equal(receipt.logs[0].args._to, toAccount, 'logs recever`s account');
			assert.equal(receipt.logs[0].args._value, 10, 'logs the transfer amount');
			return tokenInstance.balanceOf(fromAccount);
		}).then(function(sender_bal) {
			assert.equal(sender_bal.toNumber(), 90, 'updates sender`s balance');
			return tokenInstance.balanceOf(toAccount);
		}).then(function(receiver_bal) {
			assert.equal(receiver_bal.toNumber(), 10, 'updates receiver`s balance');
			return tokenInstance.allowance(fromAccount, toAccount);
		}).then(function(allowance) {
			assert.equal(allowance.toNumber(), 0, 'updates the allowance');
		});
	});
})