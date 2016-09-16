const raml = require('raml-1-parser');
const co = require('co');

const prepareFolder = require('./src/prepare-folder');
const prepareType = require('./src/prepare-type');
const writeType = require('./src/write-type');

const raml2flow = co.wrap(function* (apiPath, outputPath) {
    const api = yield raml.loadApi(apiPath);

    yield prepareFolder(outputPath);

    const writeTasks = api
        .expand()
        .types()
        .map(prepareType)
        .map(writeType(outputPath));

    return yield writeTasks;
});

module.exports = raml2flow;
