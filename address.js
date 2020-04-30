// Copyright (c) 2014-2015, hassansin
//
//Perl Ref: http://cpansearch.perl.org/src/TIMB/Geo-StreetAddress-US-1.04/US.pm
var root;
root = this;
var XRegExp;

if (typeof require !== 'undefined'){
    XRegExp = require('xregexp');
}
else
  XRegExp = root.XRegExp;

var parser = {};
var Addr_Match = {};

var Directional = {
  north       : 'N',
  northeast   : 'NE',
  east        : 'E',
  southeast   : 'SE',
  south       : 'S',
  southwest   : 'SW',
  west        : 'W',
  northwest   : 'NW',
};

var Street_Type = {
  Alley:'AL',
  Arcade:'ARC',
  Avenue:'AVE',
  Boulevard:'BLV',
  Bend:'BND',
  Bypass:'BPS',
  Brace:'BR',
  Circuit:'CCT',
  Chase:'CH',
  Circle:'CIR',
  Close:'CL',
  Common:'CMN',
  Concourse:'CNC',
  Corner:'CNR',
  Circus:'CRC',
  Crescent:'CRS',
  Crossing:'CSG',
  Corso:'CSO',
  Court:'CT',
  Centre:'CTR',
  Cove:'CVE',
  Causeway:'CWY',
  Drive:'DR',
  Driveway:'DRY',
  Entrance:'ENT',
  Esplanade:'ESP',
  Expressway:'EXP',
  Fairway:'FAY',
  Frontage:'FR',
  Freeway:'FWY',
  Garden:'GDN',
  Glade:'GL',
  Glen:'GLN',
  Grange:'GRA',
  Ground:'GRD',
  Green:'GRN',
  Gate:'GTE',
  Grove:'GVE',
  Heights:'HTS',
  Highway:'HWY',
  Junction:'JN',
  Key:'KEY',
  Lane:'LA',
  Link:'LK',
  Loop:'LP',
  Mall:'ML',
  Mount:'MT',
  Mews:'MW',
  Motorway:'MWY',
  Nook:'NK',
  Outlook:'OUT',
  Parade:'PDE',
  Place:'PL',
  Plaza:'PLZ',
  Point:'PNT',
  Promenade:'PRM',
  Pass:'PSS',
  Path:'PT',
  Parkway:'PWY',
  Quadrant:'QD',
  Quadrangle:'QDG',
  Quay:'QY',
  Road:'RD',
  Ridge:'RDG',
  Roadway:'RDY',
  Reserve:'RES',
  Rise:'RI',
  Round:'RN',
  Row:'ROW',
  Rest:'RST',
  Retreat:'RT',
  Route:'RTE',
  'Right of Way':'RTW',
  Siding:'SDG',
  Square:'SQ',
  Street:'ST',
  STS:'ST',
  Streets:'STS',
  Terrace:'TCE',
  Track:'TR',
  Trail:'TRL',
  Tollway:'TWY',
  View:'VW',
  Way:'WAY',
  Walk:'WK',
  Walkway:'WKY',
  Wynd:'WND'
};

var State_Code = {
  'New South Wales' : 'NSW',
  'Northern Territory	' : 'NT',
  'Queensland' : 'QLD',
  'South Australia' : 'SA',
  'Tasmania' : 'TAS',
  'Victoria' : 'VIC',
  'Western Australia' : 'WA'
};

var Direction_Code;
var initialized = false;

var Normalize_Map = {
  prefix: Directional,
  prefix1: Directional,
  prefix2: Directional,
  suffix: Directional,
  suffix1: Directional,
  suffix2: Directional,
  type: Street_Type,
  type1: Street_Type,
  type2: Street_Type,
  state: State_Code,
}

function capitalize(s){
  return s && s[0].toUpperCase() + s.slice(1);
}
function keys(o){
  return Object.keys(o);
}
function values(o){
  var v = [];
  keys(o).forEach(function(k){
    v.push(o[k]);
  });
  return v;
}
function each(o,fn){
  keys(o).forEach(function(k){
    fn(o[k],k);
  });
}
function invert(o){
  var o1= {};
  keys(o).forEach(function(k){
    o1[o[k]] = k;
  });
  return o1;
}
function flatten(o){
  return keys(o).concat(values(o));
}
function lazyInit(){
  if (initialized) {
    return;
  }
  initialized = true;

  Direction_Code = invert(Directional);

  Addr_Match = {
    type    : flatten(Street_Type).sort().filter(function(v,i,arr){return arr.indexOf(v)===i }).join('|'),
    fraction : '\\d+\\/\\d+',
    state   : '\\b(?:' + keys(State_Code).concat(values(State_Code)).map(XRegExp.escape).join('|') + ')\\b',
    direct  : values(Directional).sort(function(a,b){return a.length < b.length}).reduce(function(prev,curr){return prev.concat([XRegExp.escape(curr.replace(/\w/g,'$&.')),curr])},keys(Directional)).join('|'),
    dircode : keys(Direction_Code).join("|"),
    postcode: '(?<postcode>\\d{4})',
    corner  : '(?:\\band\\b|\\bat\\b|&|\\@)',
  };

  Addr_Match.number  = '(?<number>(\\d+-?\\d*))(?=\\D)';

  Addr_Match.street = '                                       \n\
    (?:                                                       \n\
      (?:(?<street_0>'+Addr_Match.direct+')\\W+               \n\
          (?<type_0>'+Addr_Match.type+')\\b                    \n\
      )                                                       \n\
      |                                                       \n\
      (?:(?<prefix_0>'+Addr_Match.direct+')\\W+)?             \n\
      (?:                                                     \n\
        (?<street_1>[^,]*\\d)                                 \n\
        (?:[^\\w,]*(?<suffix_1>'+Addr_Match.direct+')\\b)     \n\
        |                                                     \n\
        (?<street_2>[^,]+)                                    \n\
        (?:[^\\w,]+(?<type_2>'+Addr_Match.type+')\\b)         \n\
        (?:[^\\w,]+(?<suffix_2>'+Addr_Match.direct+')\\b)?    \n\
        |                                                     \n\
        (?<street_3>[^,]+?)                                   \n\
        (?:[^\\w,]+(?<type_3>'+Addr_Match.type+')\\b)?        \n\
        (?:[^\\w,]+(?<suffix_3>'+Addr_Match.direct+')\\b)?    \n\
      )                                                       \n\
    )';

  Addr_Match.po_box = 'p\\W*(?:[om]|ost\\ ?office)\\W*b(?:ox)?'

  Addr_Match.sec_unit_type_numbered = '             \n\
    (?<sec_unit_type_1>su?i?te                      \n\
      |'+Addr_Match.po_box+'                        \n\
      |(?:ap|dep)(?:ar)?t(?:me?nt)?                 \n\
      |ro*m                                         \n\
      |flo*r?                                       \n\
      |uni?t                                        \n\
      |bu?i?ldi?n?g                                 \n\
      |ha?nga?r                                     \n\
      |lo?t                                         \n\
      |pier                                         \n\
      |slip                                         \n\
      |spa?ce?                                      \n\
      |stop                                         \n\
      |tra?i?le?r                                   \n\
      |box)(?![a-z]                                 \n\
    )                                               \n\
    ';

  Addr_Match.sec_unit_type_unnumbered = '           \n\
    (?<sec_unit_type_2>ba?se?me?n?t                 \n\
      |fro?nt                                       \n\
      |lo?bby                                       \n\
      |lowe?r                                       \n\
      |off?i?ce?                                    \n\
      |pe?n?t?ho?u?s?e?                             \n\
      |rear                                         \n\
      |side                                         \n\
      |uppe?r                                       \n\
    )\\b';

  Addr_Match.sec_unit = '                               \n\
    (?:                               #fix3             \n\
      (?:                             #fix1             \n\
        (?:                                             \n\
          (?:'+Addr_Match.sec_unit_type_numbered+'\\W*) \n\
          |(?<sec_unit_type_3>\\#)\\W*                  \n\
        )                                               \n\
        (?<sec_unit_num_1>[\\w-]+)                      \n\
      )                                                 \n\
      |                                                 \n\
      '+Addr_Match.sec_unit_type_unnumbered+'           \n\
    )';

  Addr_Match.city_and_state = '                       \n\
    (?:                                               \n\
      (?<city>[^\\d,]+?)\\W+                          \n\
      (?<state>'+Addr_Match.state+')                  \n\
    )                                                 \n\
    ';

  Addr_Match.place = '                                \n\
    (?:'+Addr_Match.city_and_state+'\\W*)?            \n\
    (?:'+Addr_Match.postcode+')?                           \n\
    ';

  Addr_Match.address = XRegExp('                      \n\
    ^                                                 \n\
    [^\\w\\#]*                                        \n\
    ('+Addr_Match.number+')\\W*                       \n\
    (?:'+Addr_Match.fraction+'\\W*)?                  \n\
        '+Addr_Match.street+'\\W+                      \n\
    (?:'+Addr_Match.sec_unit+')?\\W*          #fix2   \n\
        '+Addr_Match.place+'                           \n\
    \\W*$','ix');

  var sep = '(?:\\W+|$)'; // no support for \Z

  Addr_Match.informal_address = XRegExp('                   \n\
    ^                                                       \n\
    \\s*                                                    \n\
    (?:'+Addr_Match.sec_unit+sep+')?                        \n\
    (?:'+Addr_Match.number+')?\\W*                          \n\
    (?:'+Addr_Match.fraction+'\\W*)?                        \n\
        '+Addr_Match.street+sep+'                            \n\
    (?:'+Addr_Match.sec_unit.replace(/_\d/g,'$&1')+sep+')?  \n\
    (?:'+Addr_Match.place+')?                               \n\
    ','ix');

  Addr_Match.po_address = XRegExp('                         \n\
    ^                                                       \n\
    \\s*                                                    \n\
    (?:'+Addr_Match.sec_unit.replace(/_\d/g,'$&1')+sep+')?  \n\
    (?:'+Addr_Match.place+')?                               \n\
    ','ix');

  Addr_Match.intersection = XRegExp('                     \n\
    ^\\W*                                                 \n\
    '+Addr_Match.street.replace(/_\d/g,'1$&')+'\\W*?      \n\
    \\s+'+Addr_Match.corner+'\\s+                         \n\
    '+Addr_Match.street.replace(/_\d/g,'2$&') + '($|\\W+) \n\
    '+Addr_Match.place+'\\W*$','ix');
}
parser.normalize_address = function(parts){
  lazyInit();
  if(!parts)
    return null;
  var parsed = {};

  Object.keys(parts).forEach(function(k){
    if(['input','index'].indexOf(k) !== -1 || isFinite(k))
      return;
    var key = isFinite(k.split('_').pop())? k.split('_').slice(0,-1).join('_'): k ;
    if(parts[k])
      parsed[key] = parts[k].trim().replace(/^\s+|\s+$|[^\w\s\-#&]/g, '');
  });
  each(Normalize_Map, function(map,key) {
    if(parsed[key] && map[parsed[key].toLowerCase()]) {
      parsed[key] = map[parsed[key].toLowerCase()];
    }
  });

  ['type', 'type1', 'type2'].forEach(function(key){
    if(key in parsed)
      parsed[key] = parsed[key].charAt(0).toUpperCase() + parsed[key].slice(1).toLowerCase();
  });

  if(parsed.city){
    parsed.city = XRegExp.replace(parsed.city,
      XRegExp('^(?<dircode>'+Addr_Match.dircode+')\\s+(?=\\S)','ix'),
      function(match){
        return capitalize(Direction_Code[match.dircode.toUpperCase()]) +' ';
      });
  }
  return parsed;
};

parser.parseAddress = function(address){
  lazyInit();

  var parts = XRegExp.exec(address,Addr_Match.address);
  return parser.normalize_address(parts);
};
parser.parseInformalAddress = function(address){
  lazyInit();

  var parts = XRegExp.exec(address,Addr_Match.informal_address);
  return parser.normalize_address(parts);
}; 
parser.parsePoAddress = function(address){
  lazyInit();
  var parts = XRegExp.exec(address,Addr_Match.po_address);
  return parser.normalize_address(parts);
};
parser.parseLocation = function(address){
  lazyInit();

  if (address.match(/^(\s+)?\d+\/\d+.(\D)/)) {
    address = `unit ${address}`;
  }

  return parser.parseAddress(address)
      || parser.parseInformalAddress(address);
};
parser.parseIntersection = function(address){
  lazyInit();
  var parts = XRegExp.exec(address,Addr_Match.intersection);
  parts = parser.normalize_address(parts);
  if(parts){
      parts.type2 = parts.type2 || '';
      parts.type1 = parts.type1 || '';
      if (parts.type2 && !parts.type1 || (parts.type1 === parts.type2)) {
          var type = parts.type2;
          type = XRegExp.replace(type,/s\W*$/,'');
          if (XRegExp('^'+Addr_Match.type+'$','ix').test(type)) {
              parts.type1 = parts.type2 = type;
          }
      }
  }

  return parts;
};

exports.parseIntersection = parser.parseIntersection;
exports.parseLocation = parser.parseLocation;
exports.parseInformalAddress = parser.parseInformalAddress;
exports.parseAddress = parser.parseAddress;
