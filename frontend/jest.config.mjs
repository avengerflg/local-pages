import nextJest from 'next/jest.js'
const createJestConfig = nextJest({ dir: './' })
const config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  }
}
export default createJestConfig(config)
