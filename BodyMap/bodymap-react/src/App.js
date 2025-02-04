import './App.css';
import React, { useState } from 'react'; 
const Web3 = require('web3');
const web3 = new Web3(window.ethereum);
const fetch = require('node-fetch');
const crypto = require('crypto-js');

function App() {
  const [passwordClearText, setPasswordClearText] = useState('');
  const [passwordClearTextBasic, setPasswordClearTextBasic] = useState('');
  const [passwordClearTextTailor, setPasswordClearTextTailor] = useState('');
  const [deployedContract, setDeployedContract] = useState('');
  const [deployedAddress, setDeployedAddress] = useState('');

  const handlePasswordClearTextChanged = (event) =>
  {
    setPasswordClearText(event.target.value);
  }
  const handlePasswordClearTextBasicChanged = (event) =>
  {
    setPasswordClearTextBasic(event.target.value);
  }
  const handlePasswordClearTextTailorChanged = (event) =>
  {
    setPasswordClearTextTailor(event.target.value);
  }

  const[bodyMapBasic,setBodyMapBasic] = useState({
    Height: '', Weight: ''
  });
  const [bodyMapTailor, setBodyMapTailor] = useState({
    Arms: '', Torso: '', Waist: '', Legs: '', Posture: ''
  });

  const handleBodyMapBasicChange = (e, key) =>
  {
    setBodyMapBasic({...bodyMapBasic, [key]: e.target.value});
  }
  const handleBodyMapTailorChange = (e,key) =>
  {
    setBodyMapTailor({...bodyMapTailor, [key]: e.target.value});
  }
  async function deployContract()
  {
    fetch("http://localhost:8000").then((response) => response.json()).then(async (compiledContract) => {
      const accounts = await web3.eth.getAccounts();
      let contract = await new web3.eth.Contract(compiledContract.abi)
      .deploy({data: compiledContract.evm.bytecode.object, arguments:[passwordClearText]})
      .send({from:accounts[0], gas: '1000000'});
      setDeployedContract(contract);
      setDeployedAddress(contract.options.address);
    });  
  }
  async function updateBodyMaps()
  {
    const accounts = await new web3.eth.getAccounts();
    let bodyMapBasicString = JSON.stringify(bodyMapBasic);
    let bodyMapTailorString = JSON.stringify(bodyMapTailor);
    const encryptedBodyMapBasic = crypto.AES.encrypt(bodyMapBasicString, passwordClearTextBasic).toString();
    const encryptedBodyMapTailor = crypto.AES.encrypt(bodyMapTailorString, passwordClearTextTailor).toString();
    await deployedContract.methods.setBodyMaps(passwordClearText, encryptedBodyMapBasic, encryptedBodyMapTailor).send({from: accounts[0], gas:2000000});

  }
  async function loadBodyMaps()
  {
    let newBodyMapBasicEncrypted = await deployedContract.methods.basicBodyMap().call();
    let newBodyMapTailorEncrypted = await deployedContract.methods.tailorBodyMap().call();
    
    let bodyMapBasicBytes = crypto.AES.decrypt(newBodyMapBasicEncrypted, passwordClearTextBasic);
    let bodyMapTailorBytes = crypto.AES.decrypt(newBodyMapTailorEncrypted, passwordClearTextTailor);
    setBodyMapBasic((JSON.parse(bodyMapBasicBytes.toString(crypto.enc.Utf8))));
    setBodyMapTailor((JSON.parse(bodyMapTailorBytes.toString(crypto.enc.Utf8))));
  }
  return (
    <div className="App">
      <h1>Globalmantics Body Map</h1>
      <h3>Contract address: {deployedAddress}</h3>
      <div>
        <label>Contract password</label>
        <input type="text" onchange={handlePasswordClearTextChanged}></input>
        <button onClick={deployContract}>Deploy</button>
      </div>
      <div>
        <label>Basic password</label>
        <input type="text" onchange={handlePasswordClearTextBasicChanged}></input>        
      </div>
      <div>
        <label>Tailor password</label>
        <input type="text" onchange={handlePasswordClearTextTailorChanged}></input>        
      </div>
      <h3>Basic Body Map</h3>
      {Object.keys(bodyMapBasic).map((key)=> (
        <div key={key}>
          <label>{key}:
          <input type="text" value={bodyMapBasic[key]} onChange={(e) => handleBodyMapBasicChange(e,key)} />
          </label>
          </div>
      ))}
      <h3>Tailor Body Map</h3>
      {Object.keys(bodyMapTailor).map((key)=> (
        <div key={key}>
          <label>{key}:
          <input type="text" value={bodyMapTailor[key]} onChange={(e) => handleBodyMapTailorChange(e,key)} />
          </label>
          </div>
      ))}
      <br/>
      <button onClick={updateBodyMaps}>Update Body Maps</button>
      <br/>
      <button onClick ={loadBodyMaps}>Load Body Maps</button>
    </div>
  );
}

export default App;
