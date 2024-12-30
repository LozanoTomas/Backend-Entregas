export const convertToBoolean = (value) => {
    const trueValues = [ "true", "on", "yes", "si", "1", 1, true ];
    return trueValues.includes(value);
};