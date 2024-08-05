const nextJest = require('next/jest');

const createJestConfig = nextJest();
const jestConfig = createJestConfig({
    setupFiles: ["<rootDir>/tests/jest.setup.js"],
    moduleDirectories: ["node_modules","<rootDir>"]
});

module.exports = jestConfig;