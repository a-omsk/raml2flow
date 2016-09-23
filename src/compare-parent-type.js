const compareParentType = (parentType, typeName) => {
    if (!parentType || !parentType.name) {
        return false;
    }

    const isSameParent = parentType.name() === typeName;
    const hasParent = !!parentType.parent;

    return isSameParent || (hasParent && compareParentType(parentType.parent(), typeName));
};

module.exports = compareParentType;
