pragma solidity ^0.8.19;


contract BodyMap
{

    bytes32 private passwordHash;
    string public basicBodyMap;
    string public tailorBodyMap;

    constructor(string memory passwordClearTxt)
    {
        passwordHash = keccak256(abi.encodePacked(passwordClearTxt));
    }

    function setBodyMaps(string memory passwordClearTxt, string memory newBasicBodyMap, string memory newTailorBodyMap) public
    {
        bytes32 givenPasswordHash = keccak256(abi.encodePacked(passwordClearTxt));
        if(passwordHash == givenPasswordHash)
        {
           basicBodyMap= newBasicBodyMap;
           tailorBodyMap = newTailorBodyMap;
        }
    }
}