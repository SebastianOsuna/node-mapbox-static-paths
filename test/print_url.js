var tripMapper = require('../index.js')('');

var polyline = require('polyline');

var path = [ [ 40.70758, -74.01146 ],
  [ 40.73943, -74.01157 ],
  [ 40.73934, -73.98239 ],
  [ 40.73937, -73.98227 ],
  [ 40.73935, -73.98299 ],
  [ 40.74261, -73.98299 ]
];
var mark = [-74.01146, 40.70758];

var map = tripMapper.setMark(mark).setPath(path).getUrl();
console.log(map);
