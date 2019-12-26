const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const provider = ganache.provider();
const web3 = new Web3(provider);
const { bytecode, interface } = require('../compile');

let accounts, inbox;
let initialMessage = 'Hi There!';
beforeEach(async ()=>{
    // Get a list of all accounts
    accounts = await web3.eth.getAccounts();
    // use one of the accounts to deploy the contract
    inbox = await new web3.eth.Contract(JSON.parse(interface))  // tell web3 what methods this contract will have
            .deploy({ data: bytecode, arguments: [initialMessage] })   // deploy or create a copy of this contract
            .send({ from: accounts[0], gas: '1000000' });   // tells web3 to send out this transaction that creates this contract
    inbox.setProvider(provider);
    });

describe('Inbox', ()=>{
    it('deploys a contract', ()=>{
        assert.ok(inbox.options.address);
    });
    it('has a default message', async ()=>{
        const message = await inbox.methods.message().call(); // first () to put arguments and second () is to tell how that fxn. gets called
        assert.equal(message, initialMessage);
    })
    it('can change the message', async ()=>{
        await inbox.methods.setMessage('bye').send({ from: accounts[0] }); // dont need the return transaction receipt
        // send is used as data is to be modified and we take it as a transaction so we need from where this transaction is made
        const message = await inbox.methods.message().call();
        assert.equal(message, 'bye');
    })
})