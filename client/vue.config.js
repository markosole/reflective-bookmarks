module.exports = {
    devServer: {
        port: 8080,
        host: 'localhost',
        proxy: {
            '/': {
                target: 'http://localhost:5001',
            },
        },
    }
}