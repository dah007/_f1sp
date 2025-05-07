import { BUTTON_CLASSES } from '@/constants/constants';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

export const yearsDropdown = (useShadcn: boolean = true) => {
    let year = new Date().getFullYear();
    const returnYears = [];

    if (!useShadcn) {
        while (year >= 1950) {
            returnYears.push(
                <option key={year} value={year}>
                    {year}
                </option>,
            );
            year--;
        }
    } else {
        while (year >= 1950) {
            returnYears.push(
                <SelectItem key={year} value={year as unknown as string}>
                    {year}
                </SelectItem>,
            );
            year--;
        }
    }

    return returnYears;
};

interface DropdownYearsProps {
    onFilterTextBoxChanged: (event: React.FormEvent<HTMLInputElement>) => void;
    selectedYear: number;
}

const DropdownYears: React.FC<DropdownYearsProps> = ({
    onFilterTextBoxChanged,
    selectedYear = new Date().getFullYear(),
}: DropdownYearsProps) => {
    return (
        <Select
            onValueChange={(value: string) =>
                onFilterTextBoxChanged({ currentTarget: { value } } as React.FormEvent<HTMLInputElement>)
            }
        >
            <SelectTrigger role="button" className={BUTTON_CLASSES}>
                <SelectValue placeholder={selectedYear.toString()} />
            </SelectTrigger>
            <SelectContent className="border border-zinc-900 dark:border-zinc-300 bg-zinc-300 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-300">
                {yearsDropdown(true)}
            </SelectContent>
        </Select>
    );
};

export default DropdownYears;
