const supportedValidators = ['name'];
module.exports = {
    validators: () => {
        return supportedValidators.map((validator) => {
            return require(`./validators/${validator}.js`);
        })
    }
}