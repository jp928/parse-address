var parser = require('./address');
var assert = require('assert');

var address = {
  // '9 Mulga St Blackwater QLD 4717': {
  //   city: 'Blackwater',
  //   postcode: '4717',
  //   state: 'QLD',
  //   street: 'Mulga',
  //   streetNumber: '9',
  //   type: 'St'
  // },
  // '2963 Shannons Flat Rd Shannons Flat NSW 2630': {
  //   city: 'Shannons Flat',
  //   postcode: '2630',
  //   state: 'NSW',
  //   street: 'Shannons Flat',
  //   streetNumber: '2963',
  //   type: 'Rd'
  // },
  // '3 Doris St, North Sydney, NSW 206': {
  //   city: 'North Sydney',
  //   state: 'NSW',
  //   street: 'Doris',
  //   streetNumber: '3',
  //   type: 'St'
  // },
  // 'Level 4/ 235 Macquarie St Sydney NSW 2000': {
  //   city: 'Sydney',
  //   postcode: '2000',
  //   state: 'NSW',
  //   street: 'Level 4 235 Macquarie',
  //   type: 'St'
  // },
  '20/180-90 Phillip St Sydney NSW 2000': {
    city: 'Sydney',
    postcode: '2000',
    state: 'NSW',
    street: '180 Phillip',
    streetNumber: '20',
    type: 'St'
  },
  // '123-200 Sussex St Sydney NSW 2001': {
  //   city: 'Sydney',
  //   postcode: '2001',
  //   state: 'NSW',
  //   street: 'Sussex',
  //   streetNumber: '123-200',
  //   type: 'St'
  // }
};

Object.keys(address).forEach(function (k) {
  var parsed = parser.parseLocation(k);
  console.log(parsed);
  // assert.deepEqual(address[k], parsed);
});