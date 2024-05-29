/**
 * Adapted from simple/tex2svg-page
 * run with: node service.js
 */

const config = {
  //
  //  The MathJax configuration
  //
  loader: {
    load: ['adaptors/liteDOM', 'tex-svg']
  },
  tex: {
    packages: ['base', 'autoload', 'require', 'ams', 'newcommand'],
    inlineMath: [
      ['[tex]', '[/tex]'],
      ['<span class="latex">', '</span>'],
      ['\\(', '\\)']],
    displayMath: [
      ['\\[', '\\]']],
  },
  svg: {
    fontCache: 'global',
    exFactor: 8 / 16    // ex / em
  },
  'adaptors/liteDOM': {
    fontSize:  16
  }
};

const http = require('http');
const qs = require('querystring');
const port = 8003;
const server = http.createServer(async (request, response) =>
{
  let body = '';
  request.on('data', function (data) {
    body += data;
    if (body.length > 1e8) {
      request.connection.destroy();
    }
  });

  request.on('end', async function () {

    try {
      const post = qs.parse(body);

      let init = config;
      init.startup = {
        document: post.html
      }

      require('mathjax-full').init(init)
        .then((MathJax) => {

          const adaptor = MathJax.startup.adaptor;
          const html = MathJax.startup.document;
          if (Array.from(html.math).length === 0) {
            adaptor.remove(html.outputJax.svgStyles);
            const cache = adaptor.elementById(adaptor.body(html.document), 'MJX-SVG-global-cache');
            if (cache) adaptor.remove(cache);
          }

          const output =
            adaptor.doctype(html.document)
            + adaptor.innerHTML(adaptor.body(html.document));

          response.statusCode = 200;
          response.setHeader('Content-Type', 'text/html');
          response.setHeader('Content-Length', output.length);
          response.end(output);
        })
        .catch(error => {
          console.log(error);
          response.statusCode = 500;
          response.end(error.message);
        });
    }
    catch (error) {
      console.log(error);
      response.statusCode = 500;
      response.end(error.message);
    }
  });
});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

