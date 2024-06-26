const path = require('path');

module.exports = {
    // Thêm các cấu hình cơ bản cho Webpack ở đây nếu cần
    entry: './src/index.js', // Điểm bắt đầu của ứng dụng
    output: {
        path: path.resolve(__dirname, 'dist'), // Thư mục xuất file đóng gói
        filename: 'bundle.js' // Tên file đầu ra
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx|ts|tsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript'],
                    },
                },
            },
        ],
    },
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'], // Giúp Webpack nhận diện các file mở rộng khác nhau
    },
}
