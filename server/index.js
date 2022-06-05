const express = require("express")
const app = express()
const mongoose = require('mongoose')

const cors = require('cors');

app.use(express.json());
app.use(cors());

require('./routes')(app);

mongoose.connect("mongodb+srv://keylow:1970@cluster0.q90ab.mongodb.net/MernBabylonDemo?retryWrites=true&w=majority");

app.listen(3001, () => {
  console.log("SERVER RUNS PERFECTLY!");
});