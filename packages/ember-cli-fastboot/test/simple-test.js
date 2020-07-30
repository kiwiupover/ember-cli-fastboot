'use strict';

const expect = require('chai').use(require('chai-string')).expect;
const RSVP = require('rsvp');
const request = RSVP.denodeify(require('request'));

const AddonTestApp = require('ember-cli-addon-tests').AddonTestApp;

describe('simple acceptance', function() {
  this.timeout(300000);

  let app;
  before(async function () {
    app = new AddonTestApp();
    await app.create('dummy', {
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
      url: 'http://localhost:49741/',
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

  it('with fastboot query parameter turned on', function() {
    return request({
      url: 'http://localhost:49741/?fastboot=true',
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
      url: 'http://localhost:49741/?fastboot=false',
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

  it('/posts HTML contents', function() {
    return request({
      url: 'http://localhost:49741/posts',
      headers: {
        'Accept': 'text/html'
      }
    })
      .then(function(response) {
        expect(response.statusCode).to.equal(200);
        expect(response.headers["content-type"]).to.equalIgnoreCase("text/html; charset=utf-8");
        expect(response.body).to.contain("Welcome to Ember.js");
        expect(response.body).to.contain("Posts Route!");
      });
  });

  it('/not-found HTML contents', function() {
    return request({
      url: 'http://localhost:49741/not-found',
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

  it('/boom HTML contents', function() {
    return request({
      url: 'http://localhost:49741/boom',
      headers: {
        'Accept': 'text/html'
      }
    })
      .then(function(response) {
        expect(response.statusCode).to.equal(500);
        expect(response.headers["content-type"]).to.equalIgnoreCase("text/html; charset=utf-8");
        expect(response.body).to.contain("BOOM");
      });
  });

  it('/imports HTML contents', function() {
    return request({
      url: 'http://localhost:49741/imports',
      headers: {
        'Accept': 'text/html'
      }
    })
      .then(function(response) {
        console.log(response.body);
        expect(response.statusCode).to.equal(200);
        expect(response.headers["content-type"]).to.equalIgnoreCase("text/html; charset=utf-8");
        expect(response.body).to.contain("FastBoot compatible vendor file: FastBoot default default value");
      });
  });

  it('/assets/vendor.js', function() {
    return request('http://localhost:49741/assets/vendor.js')
      .then(function(response) {
        // Asset serving is on by default
        expect(response.statusCode).to.equal(200);
        expect(response.headers["content-type"]).to.equalIgnoreCase("application/javascript; charset=utf-8");
        expect(response.body).to.contain("Ember =");
      });
  });

  it('/assets/dummy.js', function() {
    return request('http://localhost:49741/assets/dummy.js')
      .then(function(response) {
        // Asset serving is on by default
        expect(response.statusCode).to.equal(200);
        expect(response.headers["content-type"]).to.equalIgnoreCase("application/javascript; charset=utf-8");
        expect(response.body).to.not.contain("autoBoot: false");
      });
  });
});
