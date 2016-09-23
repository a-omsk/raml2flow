const { stat, mkdir } = require('mz/fs');
const co = require('co');

const { exec } = require('mz/child_process');

const prepareFolder = co.wrap(function* (path) {
    try {
        const stats = yield stat(path);

        if (stats && stats.isDirectory()) {
            yield exec(`rm -r ${path}`);
        }
    } catch (e) {
        // Do nothing
    }

    return yield mkdir(path);
});

module.exports = prepareFolder;
