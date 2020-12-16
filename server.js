const express = require('express');
const app = express();
var cors = require('cors');
const fs = require('fs');

app.use(cors())

app.get('/', function (req, res) {
  res.send('Hello World')
})

app.get('/search/:name', cors(), function (req, res, next) {
  console.log('location--->', req.params.name);
  let location = fs.readFileSync('./data/location.json');
  location = JSON.parse(location);
  var myPattern = new RegExp('(\\w*'+req.params.name+'\\w*)','gi');
  if(req.params.name != 'all')
    location = location.filter((e)=> e.name.match(myPattern))
  res.json({data: location })
})

app.get('/list', (req, res, next) => {
    res.json({msg: 'List'})
})
   
 
app.listen(3100)