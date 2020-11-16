# Channel Logos

## API Usage

An API for square channel logos, different variations.

### JSON with all channels

Includes channel name (lowercase) and logo filename

```
https://jaruba.github.io/channel-logos/logo_paths.json
```

Example of JSON entries:

```
{ 
	"fuji tv":"/yS5UJjsSdZXML0YikWTYYHLPKhQ.png",
	"abc":"/an88sKsFz0KX5CQngAM95WkncX4.png",
	...
}
```

### Channel logo variations

Currently supported logo variations (background HEX color, logo type: white / color):

- `transparent-color`
- `transparent-white`
- `fff-color`
- `05a9f4-color`
- `05a9f4-white`
- `212c39-white`
- `282c34-white`


### Channel logo URL

```
https://jaruba.github.io/channel-logos/export/transparent-color/tuomPhY2UtuPTqqFnKMVHvSb724.png
```

If you need a new background color + logo type variation, [create a pull request](https://github.com/jaruba/channel-logos/pulls) for the `web` branch or [an issue](https://github.com/jaruba/channel-logos/issues) for it.


## Building Locally

Building steps:

- fetch the latest TV channel export from TMDB and save it to a `./logo_paths.json`

- download original TMDB channel logos locally (optional)

- process all logos of the channels in the db export to make them square of a set size, with a set background color and logo color


### Prerequisites

- [Install Node.js](https://nodejs.org/en/download/) (last tested with: Node.js v8.12.0 / NPM v6.4.1)


### Install

```
git clone http://github.com/jaruba/channel-logos
cd channel-logos
npm install
```

Alternatively, if you want to download all current variations of the logos, you can use: `npm install jaruba/channel-logos#web`


### Pull TMDB TV Channel Export

This step is optional and requires a TMDB API key. If you do not pull the channel data export, then the last export that was committed to this repository will be used.

```
npm run pull tmdb-api-key
```

- `tmdb-api-key`: **required**, your TMDB API Key

This action will result in the `./logo_paths.json` file being created from the newest DB export.


### Download Original Logos Locally

This step is optional, if you download the original channel logos locally, then it will process images much faster if you need to create many different variations of the logos.

```
npm run download-all
```


### Process Images

```
npm start logo-preference background-color box-size margin
```

- `logo-preference`: _optional_, default is "color", can be: "color", "white"

- `background-color`: _optional_, default is "transparent", can be either "transparent" or a HEX color code (example: "000", "fff", "05a9f4", etc.)

- `box-size`: _optional_, default is "200", the size of the result image (which is square) in pixels

- `margin`: _optional_, default is "20", the size of the padding for the logo in pixels

This action will create a new folder in `./export` named based on the `logo-preference` and `background-color` choices with the processed images.
