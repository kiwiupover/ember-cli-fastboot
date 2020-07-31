'use strict';

const expect = require('chai').use(require('chai-string')).expect;
const RSVP = require('rsvp');
const request = RSVP.denodeify(require('request'));

const AddonTestApp = require('ember-cli-addon-tests').AddonTestApp;

describe('rootUrl acceptance', function() {
  this.timeout(300000);

  let app;

  before(async function () {
    app = new AddonTestApp();
    await app.create('root-url', {
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

  it('/ HTML contents', function() {
    return request({
      url: 'http://localhost:49741/my-root/',
      headers: {
        'Accept': 'text/html'
      }
    })
      .then(function(response) {
        expect(response.statusCode).to.equal(200);
        expect(response.headers["content-type"]).to.equalIgnoreCase("text/html; charset=utf-8");
        expect(response.body).to.contain("Welcome to Ember.js");
      });
  });

  it('Out of scope requests', function() {
    return request({
      url: 'http://localhost:49741/foo-bar/',
      headers: {
        'Accept': 'text/html'
      }
    })
      .then(function(response) {
        expect(response.statusCode).to.equal(404);
      });
  });

  it('with fastboot query parameter turned on', function() {
    return request({
      url: 'http://localhost:49741/my-root/?fastboot=true',
      headers: {
        'Accept': 'text/html'
      }
    })
      .then(function(response) {
        expect(response.statusCode).to.equal(200);
        expect(response.headers["content-type"]).to.equalIgnoreCase("text/html; charset=utf-8");
        expect(response.body).to.contain("Welcome to Ember.js");
      });
  });

  it('with fastboot query parameter turned off', function() {
    return request({
      url: 'http://localhost:49741/my-root/?fastboot=false',
      headers: {
        'Accept': 'text/html'
      }
    })
      .then(function(response) {
        expect(response.statusCode).to.equal(200);
        expect(response.headers["content-type"]).to.equalIgnoreCase("text/html; charset=utf-8");
        expect(response.body).to.contain("<!-- EMBER_CLI_FASTBOOT_BODY -->");
      });
  });
});
