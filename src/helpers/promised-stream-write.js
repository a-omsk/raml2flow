const makePromisified = (stream, method) => (chunk, options) => {
    return new Promise((resolve, reject) => {
        stream[method](chunk, options, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
};

const promisedStreamWrite = (stream) => {
    return {
        write: makePromisified(stream, 'write'),
        end: makePromisified(stream, 'end')
    };
};

module.exports = promisedStreamWrite;
