const checkField = field => type => !!(type[field] && type[field]().length);
const getType = prop => prop.type()[0];
const getArrayComponent = type => type.kind() === 'ArrayTypeDeclaration' && type.findComponentTypeDeclaration();

const getUnionComponents = (type) => {
    const runtimeDef = type.runtimeDefinition();
    const hasBranches = runtimeDef.leftType && runtimeDef.rightType;

    const origin = hasBranches ? runtimeDef : runtimeDef.superTypes()[0];

    return [
        origin.leftType().typeId(),
        origin.rightType().typeId(),
    ];
};

const hasProps = checkField('properties');
const hasEnum = checkField('enum');

module.exports = {
    hasProps,
    hasEnum,
    getType,
    getArrayComponent,
    getUnionComponents
};
