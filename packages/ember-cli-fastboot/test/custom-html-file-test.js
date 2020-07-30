'use strict';

const expect = require('chai').use(require('chai-string')).expect;
const RSVP = require('rsvp');
const request = RSVP.denodeify(require('request'));

const AddonTestApp = require('ember-cli-addon-tests').AddonTestApp;

describe('custom htmlFile', function() {
  this.timeout(400000);

  let app;

  before(async function() {
    app = new AddonTestApp();

    await app.create('custom-html-file', {
      emberDataVersion: "3.10.0",
      skipNpm: true
    });
    await app.run('npm', 'install');
    return app.startServer({
      command: 'serve'
    });
  });

  after(function() {
    return app.stopServer();
  });

  it('uses custom htmlFile', function() {
    return request({
      url: 'http://localhost:49741/',
      headers: {
        'Accept': 'text/html'
      }
    })
      .then(function(response) {
        expect(response.statusCode).to.equal(200);
        expect(response.headers["content-type"]).to.equalIgnoreCase("text/html; charset=utf-8");

        expect(response.body).to.contain("<title>custom index</title>");
        expect(response.body).to.contain("<h1>application template</h1>");
      });
  });
});
