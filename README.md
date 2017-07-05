<h1><center><img src='https://s3.brnbw.com/Joof-title-gq1SN6Paes.png' width=530 height=260 /></center></h1>

**`joof` allows you to add custom JavaScript or CSS to any webpage.**

It does so by injecting `.js` and `.css` files in `~/.joof` with a browser extension and a tiny webserver running in the background.

Similar extensions can also do this but they will probably make you use some kind of textarea-based in-browser editor like an animal and importing and exporting scripts quickly becomes tedious.

By having our customizations outside the browser in plain files you can use whatever editor you fancy and it's trivial to include them in your dotfiles or sync them with Dropbox or whatever.

If this sounds like [dotjs](https://github.com/defunkt/dotjs) it's because it is. It's the exact same idea, just maintained and with added support for CSS files.

## Installation

```sh
$ npm install -g joof
$ joof setup
```

This will …

1. Create the `~/.joof` directory
2. Install the daemon as a macOS service running on `https://localhost:3131`
3. Accept a self-signed certificate to allow `https` requests from `localhost`
4. Install a Safari extension

## Usage

Create `.js` or `.css` files in `~/.joof` with filenames matching the domain of the website you want to spice up.

Eg. for a much more creamy GitHub experience create `~/.joof/github.com.css`:

```css
body { background-color: papayawhip }
svg[class*='octicon'] { transform: rotate(180deg); }
```

<img src='https://s3.brnbw.com/Screen-Shot-2017-07-05-at-11.42.57-zNJKFuWnp5.png' alt='PapayaHub' width=366 />

When visiting `github.com` joof will look for 3 files in `~/.joof`:

1. `global.js`
2. `google.com.js`
3. `google.com.css`

## Limitations

Some sites have strict(er) Content Security Policies (eg. google.com). Good for them! But it unfortunately means that joof can't inject neither scripts nor styles into them.

## License

MIT
