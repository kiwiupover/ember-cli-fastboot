'use strict';

const expect = require('chai').use(require('chai-string')).expect;
const RSVP = require('rsvp');
const request = RSVP.denodeify(require('request'));

const AddonTestApp = require('ember-cli-addon-tests').AddonTestApp;

describe('serve assets acceptance', function() {
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

  it('/assets/vendor.js', function() {
    return request('http://localhost:49741/assets/vendor.js')
      .then(function(response) {
        expect(response.statusCode).to.equal(200);
        expect(response.headers["content-type"]).to.equalIgnoreCase("application/javascript; charset=utf-8");
        expect(response.body).to.contain("Ember =");
      });
  });

  it('/assets/dummy.js', function() {
    return request('http://localhost:49741/assets/dummy.js')
      .then(function(response) {
        expect(response.statusCode).to.equal(200);
        expect(response.headers["content-type"]).to.equalIgnoreCase("application/javascript; charset=utf-8");
        expect(response.body).to.contain("this.route('posts')");
      });
  });
});
