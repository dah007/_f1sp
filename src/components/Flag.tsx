import { getCounty2LetterCode } from '../utils/locations';
import { getName } from 'country-list';
import React from 'react';

export interface IFlagCellRendererParams {
    nameAsId?: (params: string) => string;
    twoLetterCode?: (params: string) => string;
    nationality_country_id: string;
}

type TFlagRenderer = {
    countryId: string;
    size?: number;
};

export const FlagRendererById = ({ countryId, size = 32 }: TFlagRenderer): JSX.Element => {
    return <Flag nameAsId={countryId} size={size} />;
};

type TFlag = {
    cCode?: string;
    nameAsId?: string;
    name?: string;
    size?: number;
    sizes?: {
        [key: string]: string;
        lg: string;
        md: string;
        base: string;
    };
};

/**
 * Renders a flag component.
 *
 * @param {Object} props - The properties object.
 * @param {string} props.cCode - The country code for the flag.
 * @param {string} props.nameAsId - The name to be used as the ID.
 * @param {string} props.name - The name of the flag.
 * @param {number} [props.size=64] - The size of the flag (default is 64).
 * @param {Array<number>} props.sizes - An array of available sizes.
 * @returns {JSX.Element} The rendered flag component.
 */
const Flag: React.FC<TFlag> = ({ cCode, nameAsId, name, size = 64, sizes }: TFlag): React.ReactNode => {
    if (!cCode && !nameAsId && !name) return <></>;

    let cc: string | undefined = cCode;

    if (nameAsId) {
        cc = getCounty2LetterCode(nameAsId);
    } else if (name) {
        cc = name;
    }

    let classNames = '';

    if (sizes) {
        classNames = Object.entries(sizes)
            .map(([, value]) => value)
            .join(' ');
    }

    return (
        <img
            alt={name || getName(cc || '')}
            className={classNames || ''}
            src={`https://flagsapi.com/${cc}/shiny/${size || 64}.png`}
        />
    );
};

export default Flag;
