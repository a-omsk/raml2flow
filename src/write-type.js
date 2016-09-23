
const { createWriteStream } = require('fs');
const { resolve } = require('path');
const co = require('co');
const kebabCase = require('lodash.kebabcase');

const promisedStreamWrite = require('./helpers/promised-stream-write');
const {
    flowComment,
    importTemplate,
    descriptionTemplate,
    propsTemplate
} = require('./templates');

const stringifyImports = (imports) => {
    return imports.reduce((result, value, index) => {
        const isLastImport = index === imports.length - 1;
        return result + importTemplate(value, isLastImport);
    }, '');
};

const writeType = (dirPath) => (preparedType) => {
    const {
        name,
        dependencies,
        description,
        type
    } = preparedType;

    return co(function* () {
        const path = resolve(dirPath, `${kebabCase(name)}.js`);
        const stream = createWriteStream(path);
        const writter = promisedStreamWrite(stream);

        yield writter.write(flowComment());

        if (dependencies.length) {
            const preparedImports = stringifyImports(dependencies);
            yield writter.write(preparedImports);
        }

        if (description) {
            const preparedDescription = descriptionTemplate(description);
            yield writter.write(preparedDescription);
        }

        yield writter.write(propsTemplate(name, type));

        return yield writter.end();
    });
};

module.exports = writeType;
