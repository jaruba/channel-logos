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

## Pull TMDB TV Channel Export

This step is optional and requires a TMDB API key. If you do not pull the export, then the last export that was committed to this repository will be used.

```
npm run pull tmdb-api-key
```

- `tmdb-api-key`: **required**, your TMDB API Key

This action will result in the `./logo_paths.json` file being created from the newest DB export.


## Process Images

```
npm start logo-preference background-color box-size margin
```

- `logo-preference`: _optional_, default is "color", can be: "color", "white"

- `background-color`: _optional_, default is "transparent", can be either "transparent" or a HEX color code (example: "000", "fff", "05a9f4", etc.)

- `box-size`: _optional_, default is "200", the size of the result image (which is square) in pixels

- `margin`: _optional_, default is "20", the size of the padding for the logo in pixels

This action will create a new folder in `./export` named based on the `logo-preference` and `background-color` choices with the processed images.

---

**Important:** Consider creating a PR to this repository with the `./logo_paths.json` file if you pull in a new export so we keep the data fresh in the repo too. Also, you can create a PR to the `web` branch of this repo with the exported image results. The `web` branch is available online at `https://jaruba.github.io/channel-logos/` and is a community effort to offer diverse options for TV channel logos.
