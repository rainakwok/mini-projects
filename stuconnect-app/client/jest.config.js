module.exports = {
  
    transform: {
      "^.+\\.(js|jsx)$": "babel-jest",
      ".+\\.(css|styl|less|sass|scss)$": "jest-css-modules-transform",
      // '^.+\\.(bmp|gif|jpg|jpeg|mp4|png|psd|svg|webp)$': require.resolve(
      //   '../node_modules/react-native/jest/assetfiletransformer.js',
      ".+\\.(css|scss|png|jpg|svg|jpeg)$": "jest-transform-stub"
    },
    
    testEnvironment: 'jsdom',
    testPathIgnorePatterns: ["client/cypress/"]
  };