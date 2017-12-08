const environment = Object.assign(
  require('./environment'),
  {devtool: 'cheap-eval-source-map'}
)
module.exports = environment.toWebpackConfig()
