const path = require(`path`);

module.exports = {
  webpack: {
    alias: {
      '@': path.resolve(__dirname, 'src/'),
      '@Components': path.resolve(__dirname, 'src/common/components'),
      '@Pages': path.resolve(__dirname, 'src/pages'),
      '@Slices': path.resolve(__dirname, 'src/slices'),
      '@Utils': path.resolve(__dirname, 'src/utils'),
      '@Scss': path.resolve(__dirname, 'src/assets/scss'),
    }
  }
};