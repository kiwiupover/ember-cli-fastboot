'use strict';

const chai = require('chai');
const expect = chai.expect;
chai.use(require('chai-fs'));
const AddonTestApp = require('ember-cli-addon-tests').AddonTestApp;
const glob = require('glob');

describe('rewriting HTML', function() {
  this.timeout(400000);

  let app;

  before(async function() {
    app = new AddonTestApp();

    await app.create('dummy', {
      emberDataVersion: "3.10.0",
      skipNpm: true
    });

    await app.run('npm', 'install');
  });

  it('builds an index.html that points to the browser build', async function() {
    await app.runEmberCommand('build', '--environment=production');

    let appPath = glob.sync(app.filePath('dist/assets/dummy-*.js'))[0];
    let matches = appPath.match(/dist\/assets\/dummy-(.*).js/);
    let appSHA = matches[1];

    expect(app.filePath('dist/index.html')).to.have.content.that.match(new RegExp(appSHA));
  });

});
