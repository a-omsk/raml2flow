const isString = require('lodash.isstring');
const kebabCase = require('lodash.kebabcase');

const flowComment = () => '// @flow\n\n';

const importTemplate = (value, isLast) => `import type { ${value} } from './${kebabCase(value)}';${isLast ? '\n\n' : '\n'}`;

const descriptionTemplate = value => `// ${value}\n`;

const propsTemplate = (name, value) => {
    const typeString = isString(value) ? value : JSON.stringify(value, null, '    ').replace(/"/g, '');

    return `export type ${name} = ${typeString}`;
};

module.exports = {
    flowComment,
    importTemplate,
    descriptionTemplate,
    propsTemplate
};
