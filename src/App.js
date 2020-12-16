import React, { Component } from 'react'
import Select from 'react-select'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Button, InputGroup, FormControl, ListGroup } from 'react-bootstrap';
import SelectSearch from 'react-select-search';
import transform from './utils/transform';

import CreatableSelect from 'react-select/creatable';
import AsyncSelect from 'react-select/async';


const url = 'http://localhost:3100';

const colourOptions = [
  { value: 'premium', label: 'Premium' },
  { value: 'normal', label: 'Normal' },
]
const filter = [
  { value: 'premium', label: 'Premium' },
  { value: 'normal', label: 'Normal' },
]

const handleChange = (newValue, actionMeta) => {
  console.group('Value Changed');
  console.log(newValue);
  console.log(`action: ${actionMeta.action}`);
  console.groupEnd();
};
const handleInputChange = (inputValue, actionMeta) => {
  console.group('Input Changed');
  console.log(inputValue);
  console.log(`action: ${actionMeta.action}`);
  console.groupEnd();
};


const filterColors = (inputValue) => {
  return colourOptions.filter(i =>
    i.label.toLowerCase().includes(inputValue.toLowerCase())
  );
};

const loadOptions = (inputValue, callback) => {
  setTimeout(() => {
    callback(filterColors(inputValue));
  }, 1000);
};


class Cabs extends React.Component {
  constructor() {
    super(...arguments);
    this.state = {locations: [], inputValue: ''}; 
  }
  componentDidMount() {
    this.init();
  }
  init() {
    this.location();
  }
  location(name) {
    fetch(`${url}/search/${name || 'all'}`)
    .then((resp) => resp.json()) // Transform the data into json
    .then((res)=> {
        this.setState({
          locations: transform(res.data),
        })
      // Create and append the li's to the ul
      });
  }
  handleInputChange = (newValue) => {
    const inputValue = newValue.replace(/\W/g, '');
    this.setState({ inputValue });
    return inputValue;
  };
  render() {
    return <Container>
      <Row>
        <Col xs={1}>
          S
        </Col>
        <Col xs={6}>
          <CreatableSelect
            isClearable
            onChange={handleChange}
            onInputChange={(v)=>{this.location(v)}}
            options={this.state.locations}
          />
          <AsyncSelect
            cacheOptions
            loadOptions={loadOptions}
            defaultOptions
            onInputChange={this.handleInputChange}
            />
        </Col>
        <Col xs={3}>
          <CreatableSelect
            isClearable
            onChange={handleChange}
            onInputChange={handleInputChange}
            options={filter}
          />
        </Col>
        <Col xs={2}>
          <Button variant="outline-secondary">Search</Button>
        </Col>
      </Row>
      <Row>
        <Col>
          <ListGroup>
            <ListGroup.Item>Cras justo odio</ListGroup.Item>
            <ListGroup.Item>Dapibus ac facilisis in</ListGroup.Item>
            <ListGroup.Item>Morbi leo risus</ListGroup.Item>
            <ListGroup.Item>Porta ac consectetur ac</ListGroup.Item>
            <ListGroup.Item>Vestibulum at eros</ListGroup.Item>
          </ListGroup>
        </Col>
      </Row>
    </Container>;
  }
}

export default Cabs;
