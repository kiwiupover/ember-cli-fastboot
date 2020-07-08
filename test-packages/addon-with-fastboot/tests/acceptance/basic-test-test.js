import { module, test } from 'qunit';
import { visit, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
// import fs from 'fs-extra';
// import path from 'path';

module('Acceptance | basic test', function(hooks) {
  setupApplicationTest(hooks);

  test('visiting /basic-test', async function(assert) {
    debugger;
    let config = fs.readJsonSync(app.filePath('/dist/package.json'));

    assert.equal(currentURL(), '/basic-test');
  });
});
