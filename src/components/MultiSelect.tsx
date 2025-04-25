import React from 'react';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from 'components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';
import { Button } from './ui/button';
import { BUTTON_CLASSES } from '@/constants/constants';

type Option = {
    label: string;
    value: string;
};

interface MultiSelectProps {
    placeholder: string;
    options: Option[];
    selectedOptions: string[];
    setSelectedOptions: React.Dispatch<React.SetStateAction<string[]>>;
}

const MultiSelect: React.FC<MultiSelectProps> = ({ placeholder, options, selectedOptions, setSelectedOptions }) => {
    const handleSelectChange = (value: string) => {
        let updatedOptions: string[];

        if (!selectedOptions.includes(value)) {
            updatedOptions = [...selectedOptions, value];
        } else {
            updatedOptions = selectedOptions.filter((item) => item !== value);
        }
        setSelectedOptions(updatedOptions);
    };

    const isOptionSelected = (value: string): boolean => {
        return selectedOptions.includes(value);
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <a>
                    <Button className={BUTTON_CLASSES}>
                        <div>{placeholder}</div>
                        <ChevronDown className="w-4 h-4 opacity-50" />
                    </Button>
                </a>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="start" className="w-56 bg-blend-darken bg-sky-950 text-white mt-2">
                {options?.map((option, index) => (
                    <DropdownMenuCheckboxItem
                        key={index}
                        checked={isOptionSelected(option.value)}
                        onCheckedChange={() => handleSelectChange(option.value)}
                    >
                        {option.label}
                    </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default MultiSelect;
