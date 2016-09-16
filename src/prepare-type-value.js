const flow = require('lodash.flow');
const isNAN = require('lodash.isnan');

const { prepareTypeName } = require('./prepare-type-name');
const { getType, hasEnum, getArrayComponent } = require('./helpers/getters');
const { flowPrimitives } = require('./constants');

const convertTypeNames = (value) => {
    const patterns = [
        { regexp: /datetime/, replacer: 'string' },
        { regexp: /integer/, replacer: 'number' },
        { regexp: /object/, replacer: 'Object' },
    ];

    return patterns.reduce((result, pattern) => {
        return result.replace(pattern.regexp, pattern.replacer);
    }, value);
};

const parseNullableValues = (value) => {
    const alreadyMarked = value[0] === '?';
    const nullablePattern = /^(.+)\s?\|\s?(null|nil)$/;
    const isNullable = nullablePattern.exec(value);

    if (!alreadyMarked && isNullable) {
        return `?${isNullable[1].trim()}`;
    }

    return value;
};

const parseUnion = (value) => {
    const nonPaddedDivider = '|';
    const paddedDivider = ' | ';

    if (value.indexOf(nonPaddedDivider) > -1) {
        return value.split(nonPaddedDivider).join(paddedDivider);
    }

    return value;
};

const quoteValues = (value) => {
    const isCustomValue =
        isNAN(parseInt(value, 10)) &&
        flowPrimitives.indexOf(value) === -1 &&
        value[0].toUpperCase() !== value[0];

    if (isCustomValue) {
        return `'${value}'`;
    }

    return value;
};

const parseTypeValue = flow(
    prepareTypeName,
    convertTypeNames,
    parseNullableValues,
    parseUnion
);

const parseEnumType = (type) => {
    return type.enum()
        .map(parseTypeValue)
        .map(quoteValues)
        .join(' | ');
};

const parseArrayType = (type) => {
    const component = getArrayComponent(type);
    const preparedType = component ? parseTypeValue(component.name()) : '*';

    return `Array<${preparedType}>`;
};

const prepareTypeValue = (type) => {
    if (hasEnum(type)) {
        return parseEnumType(type);
    }

    if (type.kind() === 'ArrayTypeDeclaration') {
        return parseArrayType(type);
    }

    return parseTypeValue(getType(type));
};

module.exports = prepareTypeValue;
