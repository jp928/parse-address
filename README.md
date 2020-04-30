# Australia Street Address Parser  [![Build Status](https://travis-ci.org/hassansin/parse-address.svg)](https://travis-ci.org/hassansin/parse-address)

This is Node.js port for Perl [Geo::StreetAddress::US](http://search.cpan.org/~timb/Geo-StreetAddress-US-1.04/US.pm) package

*Description from Geo::StreetAddress::Australia*:

>Geo::StreetAddress::Australia is a regex-based street address and street intersection parser for the Australia. Its basic goal is to be as forgiving as possible when parsing user-provided address strings. Geo::StreetAddress::Australia knows about directional prefixes and suffixes, fractional building numbers, building units, 4 digits postcodes, and all of the official USPS abbreviations for street types and state names...

# Notice: This library is for nodejs only

## Usage:

```javascript
//from node:
npm install parse-address-australia
var parser = require('parse-address-australia'); 
var parsed = parser.parseLocation('1005 N Gravenstein Highway Sebastopol CA 95472');


//Parsed address:
{
 number: '1005',
 prefix: 'N',
 street: 'Gravenstein',
 type: 'Hwy',
 city: 'Sebastopol',
 state: 'CA',
 zip: '95472' }
```