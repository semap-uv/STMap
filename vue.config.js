const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin')
module.exports = {
    publicPath: process.env.NODE_ENV === 'production'
        ? '/semap/mapaV2/'
        : '/',
    configureWebpack: {
        plugins: [
            new VuetifyLoaderPlugin()
        ],
    },
}