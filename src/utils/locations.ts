import { getCode } from 'country-list';
import { capitalizeFirstLetter } from './string';

export const getCounty2LetterCode = (country: string) => {
    if (!country) return;

    const ukException = country.toLowerCase() === 'united-kingdom' ? 'GB' : '';
    const ozzieException = country.toLowerCase() === 'new-zealand' ? 'NZ' : ukException;

    const saException = country.toLowerCase() === 'south-africa' ? 'ZA' : ozzieException;

    // ? AND of course, we need a US exception as well
    const finalException = country.toLowerCase() === 'united-states-of-america' ? 'US' : saException;

    return finalException || getCode(capitalizeFirstLetter(country));
};
