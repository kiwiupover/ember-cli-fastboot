'use strict';

const expect = require('chai').expect;
const RSVP = require('rsvp');
const request = RSVP.denodeify(require('request'));

const AddonTestApp = require('ember-cli-addon-tests').AddonTestApp;

describe('shoebox - put', function() {
  this.timeout(300000);

  let app;
  before(async function () {
    app = new AddonTestApp();
    await app.create('shoebox', {
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

  it('put items into the shoebox', function() {
    return request({
      url: 'http://localhost:49741/',
      headers: {
        'Accept': 'text/html'
      }
    })
      .then(function(response) {
        expect(response.statusCode).to.equal(200);
        expect(response.body).to.contain(
          '<script type="fastboot/shoebox" id="shoebox-key1">' +
          '{"foo":"bar"}' +
          '</script>'
        );
        expect(response.body).to.contain(
          '<script type="fastboot/shoebox" id="shoebox-key2">' +
          '{"zip":"zap"}' +
          '</script>'
        );
      });
  });
});
