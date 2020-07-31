'use strict';

const expect = require('chai').use(require('chai-string')).expect;
const RSVP = require('rsvp');
const request = RSVP.denodeify(require('request'));

const AddonTestApp = require('ember-cli-addon-tests').AddonTestApp;

describe('FastBoot config', function() {
  this.timeout(400000);

  let app;

  before(async function () {
    app = new AddonTestApp();

    await app.create("fastboot-config", {
      emberDataVersion: "3.10.0",
      skipNpm: true,
    });
    await app.run("npm", "install");
    return app.startServer({
      command: "serve",
    });
  });

  after(function() {
    return app.stopServer();
  });

  it('provides sandbox globals', function() {
    return request({
      url: 'http://localhost:49741/',
      headers: {
        'Accept': 'text/html'
      }
    })
      .then(function(response) {
        expect(response.statusCode).to.equal(200);
        expect(response.headers['content-type']).to.equalIgnoreCase('text/html; charset=utf-8');
        expect(response.body).to.contain('<h1>My Global</h1>');
      });
  });
});
