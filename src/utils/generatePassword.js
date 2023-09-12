const allAlphabets = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split("")];
const allNumbers = [..."1234567890".split("").map((num) => +num)];
const allSymbols = [..."!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~".split("")];

const passwordLength = 8
const getRandomNumber = () => Math.floor(Math.random() * passwordLength);

const getRandomPassword = () => {
    const randompassword = []
    const params = [
        ...allAlphabets,
        ...allNumbers,
        ...allSymbols
    ]
    while (randompassword.length < passwordLength) {
        const randomInt = Math.floor(Math.random() * params.length);
        randompassword.push(params[randomInt]);
    }
    return randompassword.join("");
};

export const generatePassword = (options) => {
    if (options) {
        const {
            alphabets,
            numbers,
            symbols
        } = options
        const generatedPasssword = [];

        for (let i = 0; i < passwordLength; i++) {
            alphabets &&
                generatedPasssword.push(allAlphabets[getRandomNumber(allAlphabets.length)]);
            numbers &&
                generatedPasssword.push(allNumbers[getRandomNumber(allNumbers.length)]);
            symbols &&
                generatedPasssword.push(allSymbols[getRandomNumber(allSymbols.length)]);
        }

        if (!generatedPasssword.length)
            return passwordLength ? generatePassword().slice(0, passwordLength) : generatePassword();
            return passwordLength
                ? generatedPasssword.slice(0, passwordLength).join("")
                : generatedPasssword.slice(0, 16).join("");
    }

    return getRandomPassword();
}