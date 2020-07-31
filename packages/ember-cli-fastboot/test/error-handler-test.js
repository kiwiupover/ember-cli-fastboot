'use strict';

const expect = require('chai').expect;
const RSVP = require('rsvp');
const request = RSVP.denodeify(require('request'));

const AddonTestApp = require('ember-cli-addon-tests').AddonTestApp;

describe('error handler acceptance', function() {
  this.timeout(300000);

  let app;

  before(async function() {
    app = new AddonTestApp();

    await app.create('error-handler', {
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

  it('visiting `/` does not result in an error', function() {
    return request({
      url: 'http://localhost:49741/',
      headers: {
        'Accept': 'text/html'
      }
    })
      .then(function(response) {
        expect(response.statusCode).to.equal(200);
      });
  });
});
