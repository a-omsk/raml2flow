const checkField = field => type => !!(type[field] && type[field]().length);

const getType = prop => prop.type()[0];

const getArrayComponentName = type => {
    if (type.kind() !== 'ArrayTypeDeclaration') {
        return null;
    }

    try {
        const declaration = type.findComponentTypeDeclaration();
        const runtimeDefinition = type.runtimeType().component.getNameAtRuntime();

        return declaration ? declaration.name() : runtimeDefinition;
    } catch(e) {
        return null;
    }
}

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
    getArrayComponentName,
    getUnionComponents
};
