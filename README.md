# Channel Logos

This module was created for use in: https://github.com/jaruba/ha-samsungtv-tizen/

With this module you can:

- fetch the latest TV channel export from TMDB and save it to a local file as JSON in the form of:
```
{ 
	"fuji tv":"/yS5UJjsSdZXML0YikWTYYHLPKhQ.png",
	"abc":"/an88sKsFz0KX5CQngAM95WkncX4.png",
	...
}
```

- process all logos of the channels in the db export to make them square of a set size, with a set background color and logo color


## Prerequisites

- [Install Node.js](https://nodejs.org/en/download/) (last tested with: Node.js v8.12.0 / NPM v6.4.1)


## Install

```
git clone http://github.com/jaruba/channel-logos
cd channel-logos
npm install
```

Alternatively, if you want to download all current variations of the logos, you can use: `npm install jaruba/channel-logos#web`


## Pull TMDB TV Channel Export

This step is optional and requires a TMDB API key. If you do not pull the channel data export, then the last export that was committed to this repository will be used.

```
npm run pull tmdb-api-key
```

- `tmdb-api-key`: **required**, your TMDB API Key

This action will result in the `./logo_paths.json` file being created from the newest DB export.


## Download Original Logos Locally

This step is optional, if you download the original channel logos locally, then it will process images much faster if you need to create many different variations of the logos.

```
npm run download-all
```


## Process Images

```
npm start logo-preference background-color box-size margin
```

- `logo-preference`: _optional_, default is "color", can be: "color", "white"

- `background-color`: _optional_, default is "transparent", can be either "transparent" or a HEX color code (example: "000", "fff", "05a9f4", etc.)

- `box-size`: _optional_, default is "200", the size of the result image (which is square) in pixels

- `margin`: _optional_, default is "20", the size of the padding for the logo in pixels

This action will create a new folder in `./export` named based on the `logo-preference` and `background-color` choices with the processed images.
