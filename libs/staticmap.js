var polyline = require('polyline'),
    request = require('request'),
    fs = require('fs'),
    isArray = require('isarray');

module.exports = function (accessToken) {

  this.BASE_URL = "https://api.mapbox.com/v4/";
  this.MAX_PATH_POINTS = 700;
  this.MAX_URL_LENGTH = 4096;

  this.paths = [];

  /*
  {filename} File name to write the downloaded image. If no file name is provided,
    the request stream is returned.
  {callback} Callback to be called after image is downloaded. callback = fn(error)
  */
  this.getMap = function (options, filename, callback) {
    var r = request(this.getUrl(options));
    if (filename) {
      r.pipe(fs.createWriteStream(filename));

      if (callback) {
        r.on('close', callback);
      }
    } else {
      return r;
    }
  };

  /*
  {options.center} Coordinates or location name to center the image into. ex
    options.center = [<lat>, <lot>]
    options.center = '<lat>,<lot>'
  {options.size} String of the desired pixel size of the image. Defaults to '500x500'.
  {options.maptype} Desired maptype. Defaults to 'mapbox.streets'.
  {options.format} Desired image format. You must include the dot. Defaults to '.png'.
  {points} List of points of the path to paint.
    points = [ [<lat>, <lot>], ... ]
  */
  this.getUrl = function (options) {
    options = options || {};
    // Clean inputs
    options.center = options.center || 'auto';
    if (options.center && isArray(options.center)) {
      options.center = options.center[0] + ',' + options.center[1];
    }

    if (options.zoom && (!parseInt(options.zoom) || options.zoom < 0 || options.zoom > 21)) {
      options.zoom = undefined;
    }

    options.size = options.size || '500x500';
    options.maptype = options.maptype || 'mapbox.streets';
    options.format = options.format || '.png';

    // Build the url
    var params = [];
    params.push(options.maptype);
    params.push(this.paths.join(','));
    params.push(options.center);
    params.push(options.size);

    var url = this.BASE_URL + params.join('/') + options.format;

    if (accessToken) {
      url += "?access_token=" + accessToken;
    }

    // Clear paths
    this.paths = [];

    if (url.length > this.MAX_URL_LENGTH) {
      throw 'Url too long. Think about cutting off some points';
    }

    return url;
  };

  function calculateCenter (points) {
    var mxlat, mxlot, mnlat = 200, mnlot = 200;
    points.forEach(function (p) {
      if (p[0] > mxlat) {
        mxlat = p[0];
      }
      if (p[1] > mxlot) {
        mxlot = p[1];
      }
      if (p[1] < mnlot) {
        mnlot = p[1];
      }
      if (p[0] < mnlat) {
        mnlat = p[0];
      }
    });
    return [(mnlat+mxlat)/2, (mnlot+mxlot)/2];
  }

  /*
  {options.color} Color of the line in hex
  {options.opacity} Opacity of the drawn line
  */
  this.setPath = function(points, options) {
    // Set defaults
    options = options || {};
    options.path = options.path || '4';
    options.strokecolor = options.strokecolor || '44f';
    options.strokeopacity = options.strokeopacity || '1';
    options.fillcolor = options.fillcolor || '0f0';
    options.fillopacity = options.fillopacity || '0';

    if (points.length > this.MAX_PATH_POINTS) {
      var dropFactor = points.length / this.MAX_PATH_POINTS,
          selectedPoints = [];
      for (var i = 0, j = 0; i < points.length && (j = Math.round(i*dropFactor)) < points.length; i++){
        selectedPoints.push(j);
      }
      points = points
        .filter(function (p, i) {
          return !!p && selectedPoints.indexOf(i) > -1;
        });
    }

    var path = polyline.encode(points);

    this.paths.push("path-" + options.path + "+" + options.strokecolor + "-" + options.strokeopacity +
            "+" + options.fillcolor + "-" + options.fillopacity +
            "(" + encodeURIComponent(path) + ")");
    return this;
};
  /*
  {options.name} name of mark pin-s, pin-m, pin-l
  {options.label} Marker symbol. An alphanumberic label or valid Maki icon.
a-z, 0-9,  aerialway, airfield, airport, alcohol-shop, america-football, art-gallery, bakery, bank, bar, baseball, basketball, beer, bicycle, building, bus, cafe, camera, campsite, car, cemetery, chemist, cinema, circle-stroked, circle, city, clothing-store, college, commercial, cricket, cross, dam, danger, dentist, disability, dog-park, embassy, emergency-telephone, entrance, farm, fast-food, ferry, fire-station, fuel, garden, gift, golf, grocery, hairdresser, harbor, heart, heliport, hospital, ice-cream, industrial, land-use, laundry, library, lighthouse, lodging, logging, london-underground, marker-stroked, marker, minefield, mobilephone, monument, museum, music, oil-well, park2, park, parking-garage, parking, pharmacy, pitch, place-of-worship, playground, police, polling-place, post, prison, rail-above, rail-light, rail-metro, rail-underground, rail, religious-christian, religious-jewish, religious-muslim, restaurant, roadblock, rocket, school, scooter, shop, skiing, slaughterhouse, soccer, square-stroked, square, star-stroked, star, suitcase, swimming, telephone, tennis, theatre, toilets, town-hall, town, triangle-stroked, triangle, village, warehouse, waste-basket, water, wetland, zoo
  {options.color} An 3 or 6 digit RGB hex color.
  */
  this.setMark = function(point, options) {
    // Set defaults
    options = options || {};
    options.name = options.name || 'pin-s';
    options.label = options.label || 'star';
    options.color = options.name === 'url' ? null : (options.color || 'ff6633');

    var path = point;

    this.paths.push(options.name + "-" + options.label + (options.color ? "+" + options.color : "") +
           "(" + encodeURIComponent(path) + ")");
    return this;
};

  return this;
};
