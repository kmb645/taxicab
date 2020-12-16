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

app.get('/location/:id', (req, res) => {
  console.log('location--->', req.params.id);
  let location = fs.readFileSync('./data/location.json');
  location = JSON.parse(location);
  var myPattern = new RegExp('(\\w*'+req.params.id+'\\w*)','gi');
  if(req.params.id != 'all')
    location = location.filter((e)=> e.name.match(myPattern))
  res.json({data: location })
})

app.get('/search/:location/:carType', (req, res) => {
  let rng = 4;
  let locations = fs.readFileSync('./data/location.json');
  locations = JSON.parse(locations);
  locations = locations.filter((e)=>e.id == req.params.location)[0];
  let lat = locations.lat.slice(0, rng);
  let lng = locations.lng.slice(0, rng);

  let allCabs = fs.readFileSync('./data/cabs.json');
  allCabs = JSON.parse(allCabs);

  allCabs = allCabs.filter((e)=> e.lat.slice(0,rng) == lat && e.lng.slice(0,rng) == lng);
  if(req.params.carType != 'all')
    allCabs = allCabs.filter((e)=> e.cabType == req.params.carType);
  res.json({data:  allCabs})
})

app.post('/save', (req, res) => {
  let data = JSON.stringify(req.body);
  fs.writeFileSync('data/output.json', data);
  res.json({satus: 'Success'})
})
   
 
app.listen(3100)