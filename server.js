const express = require('express');
const app = express();
var cors = require('cors');
const fs = require('fs');
var bodyParser = require('body-parser')

app.use(cors())
app.use(bodyParser.json())

app.get('/', function (req, res) {
  let path = './data/output.json';
  try {
    if (fs.existsSync(path)) {
      let output = fs.readFileSync(path);
      output = JSON.parse(output);
      res.json({data: output});
    }
  } catch(err) {
    console.error(err)
  }
})

app.get('/location/:id', cors(), function (req, res, next) {
  console.log('location--->', req.params.id);
  let location = fs.readFileSync('./data/location.json');
  location = JSON.parse(location);
  var myPattern = new RegExp('(\\w*'+req.params.id+'\\w*)','gi');
  if(req.params.id != 'all')
    location = location.filter((e)=> e.name.match(myPattern))
  res.json({data: location })
})

app.get('/search/:location/:carType', cors(), function (req, res, next) {
  console.log('location--->', req.params);
  let cabs = fs.readFileSync('./data/availableCabs.json');
  cabs = JSON.parse(cabs);
  cabs = cabs.filter((e)=> e.locationId == req.params.location)[0].cabs;
  let allCabs = fs.readFileSync('./data/cabs.json');
  allCabs = JSON.parse(allCabs);
  allCabs = allCabs.filter((e)=> cabs.includes(e.locationId));
  if(req.params.carType != 'all')
    allCabs = allCabs.filter((e)=> e.cabType == req.params.carType);
  res.json({data: allCabs })
})

app.get('/list', (req, res, next) => {
    res.json({msg: 'List'})
})

app.post('/save', (req, res) => {
  console.log(req.body);
  let data = JSON.stringify(req.body);
  fs.writeFileSync('data/output.json', data);
  res.json({satus: 'Success'})
})
   
 
app.listen(3100)