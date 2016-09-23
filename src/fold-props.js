const { prepareTypeName, markAsUnrequired } = require('./prepare-type-name');
const prepareTypeValue = require('./prepare-type-value');
const { hasProps } = require('./helpers/getters');

const foldProps = (type, isNested) => {
    if (!isNested) {
        return prepareTypeValue(type);
    }

    return type.properties().reduce((result, prop) => {
        const name = prop.name();
        const isRequired = prop.required();

        const fieldName = markAsUnrequired(prepareTypeName(name), isRequired);
        const stillNested = hasProps(prop);

        result[fieldName] = foldProps(prop, stillNested);

        return result;
    }, {});
};

module.exports = foldProps;
