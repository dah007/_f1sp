import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import react from "eslint-plugin-react";
import globals from "globals";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [
    ...compat.extends(
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:@typescript-eslint/recommended",
    ).map(config => ({
        ...config,
        files: ["**/*.ts", "**/*.tsx"],
    })),
    {
        files: ["**/*.ts", "**/*.tsx"],
        plugins: {
            "@typescript-eslint": typescriptEslint,
            react,
        },
        languageOptions: {
            parser: tsParser,
            ecmaVersion: 2020,
            sourceType: "module",
            globals: {
                ...globals.browser,
            },
        },
        settings: {
            react: {
                version: "detect", // Automatically detect the React version
            },
        },
        rules: {
            "react/react-in-jsx-scope": "off",
            "@typescript-eslint/no-unused-expressions": ["error", { "allowShortCircuit": true, "allowTernary": true }],
            "react/prop-types": "off", // Disable prop-types as we use TypeScript for type checking
        },
    },
];
