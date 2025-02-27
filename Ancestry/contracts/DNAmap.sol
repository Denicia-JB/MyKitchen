// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;
import "@openzeppelin/contracts/access/IAccessControl.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DNAmap is Ownable
{
    mapping (address => DNAData) public dnaList;
    uint public registrationFee;
    uint public updateFee;
    uint256 public totalFeesAllocated;
    address noOwner  = 0x0000000000000000000000000000000000000000; //zero address

    constructor(uint _regFee, uint _updateFee) Ownable(msg.sender)
    {    
        registrationFee = _regFee;
        updateFee = _updateFee;    
    }

    function registerDNA(string memory _name, uint256 _birthDate, bytes memory _dnaEncrypt) public payable
    {
        require(msg.value == registrationFee, "Insufficient funds");

        require(dnaList[msg.sender].owner == noOwner, "Already registered");

        dnaList[msg.sender] = DNAData({owner: msg.sender, name: _name, 
                                birthDate: _birthDate, dnaEncrypt: _dnaEncrypt});
        
        payable(owner()).transfer(msg.value);

        totalFeesAllocated += registrationFee;        
    }

    function updateNonEncryptedDNA(string [] memory _codes) public payable 
    {
        require(msg.value == updateFee, "Insufficient funds");
        require(dnaList[msg.sender].owner == msg.sender, "User not registered");        
        
        bytes memory encrypted = abi.encode(_codes);
        dnaList[msg.sender].dnaEncrypt = encrypted;
        
        payable(owner()).transfer(msg.value);
        
        totalFeesAllocated += _updateFee;        
    }

    function getDNAData() view public onlyOwner returns (DNAData memory)
    {
        DNAData memory dnaData = dnaList[msg.sender];

        return dnaData;
    } 

    struct DNAData
    {
        address owner;
        string name;
        uint256 birthDate;
        bytes dnaEncrypt;
    }   
}