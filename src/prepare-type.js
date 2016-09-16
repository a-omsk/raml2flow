const { prepareTypeName } = require('./prepare-type-name');
const { hasProps } = require('./helpers/getters');
const foldProps = require('./fold-props');
const foldDeps = require('./fold-deps');

const prepareType = (type, _, types) => {
    const description = type.description();
    const descriptionValue = description && description.value();

    const isNested = hasProps(type);
    const dependencies = foldDeps(type, isNested, types);
    const props = foldProps(type, isNested);

    process.stdout.write(`${type.name()} was prepared.\n`);

    return {
        name: prepareTypeName(type.name()),
        description: descriptionValue,
        type: props,
        dependencies
    };
};

module.exports = prepareType;
