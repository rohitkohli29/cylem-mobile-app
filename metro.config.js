const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
const path = require('path');

module.exports = mergeConfig(getDefaultConfig(__dirname), {
    resolver: {
        alias: {
            '@': path.resolve(__dirname, './app'),
            '~': path.resolve(__dirname, './'),
        },
    },
});
