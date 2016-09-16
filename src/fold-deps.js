const compact = require('lodash.compact');
const flattenDeep = require('lodash.flattendeep');
const uniq = require('lodash.uniq');
const flow = require('lodash.flow');

const compareParentType = require('./compare-parent-type');
const { prepareImportsName } = require('./prepare-type-name');
const {
    hasProps,
    hasEnum,
    getType,
    getArrayComponent,
    getUnionComponents
} = require('./helpers/getters');


const findInNameSpace = (typeName, types) => {
    return types
        .map(t => t.name())
        .indexOf(typeName) > -1;
};

const prepareImports = (parent, types) => (typeNames) => {
    return typeNames
        .filter(t => findInNameSpace(t, types) && !compareParentType(parent, t))
        .map(prepareImportsName);
};

const processDependency = (type, types) => {
    const prepare = prepareImports(type.parent(), types);
    const isArray = type.kind() === 'ArrayTypeDeclaration';
    const isUnion = type.kind() === 'UnionTypeDeclaration';
    const isEnum = hasEnum(type);

    if (isUnion) {
        const names = getUnionComponents(type);
        return prepare(names);
    }

    if (isEnum) {
        return prepare(type.enum());
    }

    if (isArray) {
        const component = getArrayComponent(type);
        return component && prepare([component.name()]);
    }

    return prepare([getType(type)]);
};

const foldDeps = (type, isNested, types) => {
    if (!isNested) {
        return [processDependency(type, types)];
    }

    return type.properties().map((prop) => {
        const stillNested = hasProps(prop);

        if (stillNested) {
            return foldDeps(prop, stillNested, types);
        }

        return processDependency(prop, types);
    });
};

module.exports = flow(
    foldDeps,
    flattenDeep,
    compact,
    uniq
);
