const prepareTypeName = (name) => {
    return name.replace(/Object/, '');
};

const prepareImportsName = (name) => {
    return prepareTypeName(name).replace(/object|array/, '');
};

const markAsUnrequired = (name, isRequired) => {
    return isRequired ? name : `${name}?`;
};

module.exports = {
    prepareTypeName,
    prepareImportsName,
    markAsUnrequired
};
