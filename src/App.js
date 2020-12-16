import React, { Component } from 'react'
import Select from 'react-select'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Button, ListGroup } from 'react-bootstrap';
import transform from './utils/transform';

import AsyncSelect from 'react-select/async';


const url = 'http://localhost:3100';

const filter = [
  { value: 'premium', label: 'Premium' },
  { value: 'normal', label: 'Normal' },
]

class Cabs extends React.Component {
  constructor() {
    super(...arguments);
    this.state = {cabList: [], selectedLocation: null, selectedType: null}; 
  }
  componentDidMount() {
    this.init();
  }
  init() {
    this.get();
  }
  get() {
    fetch(url)
    .then((resp) => resp.json())
    .then((res)=> {
        this.setState({
          cabList: [...res.data],
        })
      });
  }
  changeLocation = (selectedLocation) => {
    this.setState({ selectedLocation });
    return selectedLocation;
  };
  changeType = selectedType => {
    this.setState({ selectedType });
    return selectedType;
  };
  loadOptions = (inputValue, callback) => {
    fetch(`${url}/location/${inputValue || 'all'}`)
    .then((resp) => resp.json())
    .then((res)=> {
        callback(transform(res.data));
      });
  };
  search() {
    const { selectedLocation , selectedType } = this.state;
    if(selectedLocation && selectedLocation.value) {
      fetch(`${url}/search/${selectedLocation.value}/${selectedType && selectedType.value ? selectedType.value : 'all'}`)
      .then((resp) => resp.json())
      .then((res)=> {
          this.setState({cabList: [...res.data]});
        });
    } else {
      alert('You have to put location');
    }
  }
  async save() {
    fetch(`${url}/save`, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.state.cabList)
    }).then((e)=> alert('Success'));
  }
  render() {
    const {selectedType, cabList} = this.state;
    return <Container>
      <br/>
      <Row>
        <Col xs={7}>
          <AsyncSelect
            isClearable
            cacheOptions
            loadOptions={this.loadOptions}
            defaultOptions
            onChange={this.changeLocation}
            />
        </Col>
        <Col xs={3}>
          <Select
            isClearable
            value={selectedType}
            onChange={this.changeType}
            options={filter}
          />
        </Col>
        <Col xs={2}>
          <Button onClick={()=> {this.search()}} variant="outline-secondary">Search</Button>
        </Col>
      </Row>
      <br/>
      <Row>
        <Col xs={10}>
          <ListGroup>
            {
              cabList.map((item, index) =>
                <ListGroup.Item key={index}>{item.name} - {item.cabType}</ListGroup.Item>
              )
            }
          </ListGroup>
        </Col>
      </Row>
      <br/>
      <Row>
        <Col xs={10} style={{textAlign:'center'}}>
          <Button onClick={()=> {this.save()}} variant="success">Save</Button>
        </Col>
      </Row>
    </Container>;
  }
}

export default Cabs;
