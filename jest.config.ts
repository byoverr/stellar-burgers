/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import {JestConfigWithTsJest, pathsToModuleNameMapper} from 'ts-jest';
import { compilerOptions } from './tsconfig.json';

const config: JestConfigWithTsJest = {
    collectCoverage: true,
    coverageDirectory: 'coverage',
    coverageProvider: 'v8',
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    collectCoverageFrom: [
        "src/services/*.ts",
        "src/slices/*.ts",
        "!src/utils/burger-api.ts",
    ],
    transform: {
        // '^.+\\.[tj]sx?$' для обработки файлов js/ts с помощью `ts-jest`
        // '^.+\\.m?[tj]sx?$' для обработки файлов js/ts/mjs/mts с помощью `ts-jest`
        '^.+\\.tsx?$': [
            'ts-jest',
            {
                // настройки для ts-jest
            },
        ],
    },
    moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
        prefix: '<rootDir>/',
    }),
};

export default config;
