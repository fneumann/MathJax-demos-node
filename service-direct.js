/**
 * Adapted from direct/tex2svg-page
 * run with: node service.js
 */

//
//  Load the packages needed for MathJax
//
const {mathjax} = require('mathjax-full/js/mathjax.js');
const {TeX} = require('mathjax-full/js/input/tex.js');
const {SVG} = require('mathjax-full/js/output/svg.js');
const {liteAdaptor} = require('mathjax-full/js/adaptors/liteAdaptor.js');
const {RegisterHTMLHandler} = require('mathjax-full/js/handlers/html.js');
const {AssistiveMmlHandler} = require('mathjax-full/js/a11y/assistive-mml.js');

const {AllPackages} = require('mathjax-full/js/input/tex/AllPackages.js');

require('mathjax-full/js/util/entities/all.js');

const PACKAGES = ['base', 'autoload', 'require', 'ams', 'newcommand'];


const http = require('node:http');
const qs = require('node:querystring');
const port = 8003;
const server = http.createServer(
  async (request, response) =>
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
      const tex = new TeX({
        packages: PACKAGES,
        inlineMath: [
          ['[tex]', '[/tex]'],
          ['<span class="latex">', '</span>'],
          ['\\(', '\\)']],
        displayMath: [
          ['\\[', '\\]']],
      });

      const svg = new SVG({
        fontCache: 'global',
        exFactor: 8 / 16    // ex / em
      });

      const adaptor = liteAdaptor({
        fontSize: 16
      });
      AssistiveMmlHandler(RegisterHTMLHandler(adaptor));

      const post = JSON.parse(body);
      const html = mathjax.document(post.page, {InputJax: tex, OutputJax: svg});

      //  Typeset the document
      html.render();

      if (Array.from(html.math).length === 0) {
        adaptor.remove(html.outputJax.svgStyles);
        const cache = adaptor.elementById(adaptor.body(html.document), 'MJX-SVG-global-cache');
        if (cache) adaptor.remove(cache);
      }

      const output =
        adaptor.doctype(html.document)
        + adaptor.outerHTML(adaptor.root(html.document));

      response.statusCode = 200;
      response.setHeader('Content-Type', 'text/html');
      response.setHeader('Content-Length', output.length);
      response.end(output);

    }
    catch (error) {
      console.log(error);
      response.statusCode = 500;
      response.end(error.message);
    }
  });
});

server.listen(port, () => {
  console.log(`Direct server running on port ${port}`);
});

