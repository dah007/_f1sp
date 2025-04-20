import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines multiple class names into a single string.
 *
 * This function merges class names using `clsx` and `twMerge` to handle conditional
 * and dynamic class names, ensuring that Tailwind CSS classes are properly merged.
 *
 * @param {...ClassValue[]} inputs - The class names to combine. These can be strings,
 * arrays, or objects where the keys are class names and the values are booleans.
 * @returns {string} - The combined class names as a single string.
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}
