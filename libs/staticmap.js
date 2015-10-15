var polyline = require('polyline'),
    request = require('request'),
    fs = require('fs'),
    isArray = require('isarray');


module.exports = function (accessToken) {

  this.BASE_URL = "https://api.mapbox.com/v4/";

  /*
  getMap(points, [options [, filename [, callback]]]).
  See #getUrl default options.
  {filename} File name to write the downloaded image. If no file name is provided,
    the request stream is returned.
  {callback} Callback to be called after image is downloaded. callback = fn(error)
  */
  this.getMap = function (points, options, filename, callback) {
    var r = request(this.getUrl(points, options));
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
  this.getUrl = function (points, options) {
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
    points = points || [];

    // Build the url
    var params = [];
    params.push(options.maptype);
    params.push(makePath(points));
    params.push(options.center);
    params.push(options.size);

    var url = this.BASE_URL + params.join('/') + options.format;

    if (accessToken) {
      url += "?access_token=" + accessToken;
    }

    if (url.length > 4096) {
      throw 'Url too long. Think about cutting off some points';
    }

    return url;
  };

  /*
  {options.color} Color of the line in hex
  {options.opacity} Opacity of the drawn line
  */
  function makePath (points, options) {
    // Set defaults
    options = options || {};
    options.color = options.color || '44f';
    options.opacity = options.opacity || '1';

    var path = polyline.encode(points);

    return "path+" + options.color + "-" + options.opacity +
           "(" + encodeURIComponent(path) + ")";
  }

  return this;
};
