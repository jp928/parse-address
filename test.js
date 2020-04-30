var parser = require('./address');
var assert = require('assert');

var address = {
  '9 Mulga St Blackwater QLD 4717': {
    city: 'Blackwater',
    number: '9',
    postcode: '4717',
    state: 'QLD',
    street: 'Mulga',
    type: 'St'
  },
  '2963 Shannons Flat Rd Shannons Flat NSW 2630': {
    city: 'Shannons Flat',
    number: '2963',
    postcode: '2630',
    state: 'NSW',
    street: 'Shannons Flat',
    type: 'Rd'
  },
  '3 Doris St, North Sydney, NSW 206': {
    city: 'North Sydney',
    number: '3',
    state: 'NSW',
    street: 'Doris',
    type: 'St'
  },
  'Level 4/ 235 Macquarie St Sydney NSW 2000': {
    city: 'Sydney',
    postcode: '2000',
    state: 'NSW',
    street: 'Level 4 235 Macquarie',
    type: 'St'
  },
  '20/180-90 Phillip St Sydney NSW 2000': {
    city: 'Sydney',
    number: '180-90',
    postcode: '2000',
    sec_unit_num: '20',
    sec_unit_type: 'unit',
    state: 'NSW',
    street: 'Phillip',
    type: 'St'
  },
  '123-200 Sussex St Sydney NSW 2001': {
    city: 'Sydney',
    number: '123-200',
    postcode: '2001',
    state: 'NSW',
    street: 'Sussex',
    type: 'St'
  },
  '2 Hampden Street, North Sydney, NSW 2060 ': {
    city: 'North Sydney',
    number: '2',
    postcode: '2060',
    state: 'NSW',
    street: 'Hampden',
    type: 'Street'
  }
};

Object.keys(address).forEach(function (k) {
  var parsed = parser.parseLocation(k);
  assert.deepEqual(address[k], parsed);
});