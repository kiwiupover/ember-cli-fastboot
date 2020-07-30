'use strict';

const expect = require('chai').use(require('chai-string')).expect;
const RSVP = require('rsvp');
const request = RSVP.denodeify(require('request'));

const AddonTestApp = require('ember-cli-addon-tests').AddonTestApp;

describe('head content acceptance', function() {
  this.timeout(300000);

  let app;
  before(async function () {
    app = new AddonTestApp();

    await app.create('head-content', {
      emberDataVersion: "3.10.0",
      skipNpm: true
    });

    addDependencies(app);

    await app.run('npm', 'install');
    return app.startServer({
      command: 'serve'
    });
  });

  after(function() {
    return app.stopServer();
  });

  it('/ Has head content replaced', function() {
    return request({
      url: 'http://localhost:49741/',
      headers: {
        'Accept': 'text/html'
      }})
      .then(function(response) {
        expect(response.statusCode).to.equal(200);
        expect(response.headers["content-type"]).to.equalIgnoreCase("text/html; charset=utf-8");
        expect(response.body).to.contain('<meta property="og:title" content="Head Data Title">');
        expect(response.body).to.not.contain('<!-- EMBER_CLI_FASTBOOT_HEAD -->');
      });
  });
});

function addDependencies(app) {
  app.editPackageJSON(function(pkg) {
    pkg['devDependencies']['ember-cli-head'] = "0.3.1";
  });
}
