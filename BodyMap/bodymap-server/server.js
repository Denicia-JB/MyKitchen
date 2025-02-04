const {compiledContract} = require('./compile');
const cors = require("cors");
const corOptions = {orgin: "http://localhost:3000"};
const express = require('express');
const app = express();
app.use(cors(corOptions));
app.get('/', (req,res) =>{
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(compiledContract));
})
app.listen(8000, ()=>{
    console.log("Body Map Compile Server is running...")
})