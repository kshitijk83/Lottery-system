pragma solidity ^0.4.25;

contract Inbox {
    string public message;

    constructor(string initMessage) public {
        message = initMessage;
    }

    function setMessage(string setMsg) public {
        message = setMsg;
    }

}