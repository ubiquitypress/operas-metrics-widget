const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: './src/index.jsx',
  output: {
    filename: 'widget.js'
  },
  devServer: {
    contentBase: './dist'
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Use `style-loader` to render things during development, but we want to separate
          // the CSS from the JS when building, so we'll use the MiniCssExtractPlugin for that
          process.env.NODE_ENV === 'development'
            ? 'style-loader'
            : MiniCssExtractPlugin.loader,

          // We're telling `css-loader` to rename our classes `mw__[local]` so they can be
          // overriden by anyone using the widget - just be careful of conflicts.
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: 'mw__[local]'
              }
            }
          },

          // Using `sass-loader` allows us to use .scss files, making things much cleaner
          'sass-loader'
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'widget.css'
    })
  ]
};
