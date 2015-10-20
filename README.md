# Static Mapbox paths
Generate an Static Mapbox url to draw a path on a map.

## Usage
Install

```
npm install mapbox-static-paths --save
```

Require

```javascript
var mapboxPaths = require('mapbox-static-paths')(PUBLIC_TOKEN);
```

Generate urls

```javascript
var url = mapboxPaths.setPath([ [40.749825,-73.987963], [40.752946,-73.987384], [40.755823,-73.986397] ]).getUrl();
```

Generate urls and mark

```javascript
var url = mapboxPaths.setMark([-73.987963,40.749825]).setPath([ [40.749825,-73.987963], [40.752946,-73.987384], [40.755823,-73.986397] ]).getUrl();
```

Or download the image

```javascript
mapboxPaths.getMap([ [40.749825,-73.987963], [40.752946,-73.987384], [40.755823,-73.986397] ], {}, './mymap.png');
```
## FUNCTIONS

### setPath
    setPath(points, options)

    #points
        [ [lon 1, lat 1], [lon 2, lat 2], ... [lon n, lat n]]
    #options
        {
            path: size in pixels
            strokecolor: An 3 or 6 digit RGB hex color
            strokeopacity: 1 to 255
            fillcolor: An 3 or 6 digit RGB hex color
            fillopacity: 1 to 255
        }

### setMark
    setMark(point, options)

    #points
        [ lat, lon ]
    #options
        {
            name: name of mark pin-s, pin-m, pin-l
            label: An alphanumberic label or valid Maki icon.
          a-z, 0-9,  aerialway, airfield, airport, alcohol-shop, america-football, art-gallery, bakery, bank, bar, baseball, basketball, beer, bicycle, building, bus, cafe, camera, campsite, car, cemetery, chemist, cinema, circle-stroked, circle, city, clothing-store, college, commercial, cricket, cross, dam, danger, dentist, disability, dog-park, embassy, emergency-telephone, entrance, farm, fast-food, ferry, fire-station, fuel, garden, gift, golf, grocery, hairdresser, harbor, heart, heliport, hospital, ice-cream, industrial, land-use, laundry, library, lighthouse, lodging, logging, london-underground, marker-stroked, marker, minefield, mobilephone, monument, museum, music, oil-well, park2, park, parking-garage, parking, pharmacy, pitch, place-of-worship, playground, police, polling-place, post, prison, rail-above, rail-light, rail-metro, rail-underground, rail, religious-christian, religious-jewish, religious-muslim, restaurant, roadblock, rocket, school, scooter, shop, skiing, slaughterhouse, soccer, square-stroked, square, star-stroked, star, suitcase, swimming, telephone, tennis, theatre, toilets, town-hall, town, triangle-stroked, triangle, village, warehouse, waste-basket, water, wetland, zoo
            color: An 3 or 6 digit RGB hex color
        }

### getUrl
    getUrl(options)

    #options
        {
            center: [ lat, lon ] or 'auto'
            zoom: 1 to 20
            size: pixels in string format, '500x500', maximum size for a static map image is 1280x1280
            maptype: 'mapbox.streets'
            format: '.png'
        }
        #format
            @2x.png	2x scale (retina)
            .png32	32 color indexed PNG
            .png64	64 color indexed PNG
            .png128	128 color indexed PNG
            .png256	256 color indexed PNG
            .jpg70	70% quality JPG
            .jpg80	80% quality JPG
            .jpg90	90% quality JPG

### getMap
    getMap(options, filename, callback)

    #options
        {
            center: [ lat, lon ] or 'auto'
            zoom: 1 to 20
            size: pixels in string format, '500x500', maximum size for a static map image is 1280x1280
            maptype: 'mapbox.streets'
            format: '.png'
        }
        #format
            @2x.png	2x scale (retina)
            .png32	32 color indexed PNG
            .png64	64 color indexed PNG
            .png128	128 color indexed PNG
            .png256	256 color indexed PNG
            .jpg70	70% quality JPG
            .jpg80	80% quality JPG
            .jpg90	90% quality JPG
    #filename path of your file
    #callback function of callback

## TEST

To run the test suite, first install the dependencies, then run `npm test`:

```bash
$ cd test
$ npm install
$ node print_url
```

## CONTRIBUTING
Currently only accepting PR's. I don't have much time to work on new features.

Help with documentations, test and all that jazz is greatly appreciated.

## LICENSE

  [MIT](LICENSE)
