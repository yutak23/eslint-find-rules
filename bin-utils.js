var path = require('path')
var isAbsolute = require('path-is-absolute')
var eslint = require('eslint')

function getConfigFile(specifiedFile) {
  //var specifiedFile = process.argv[2]
  if (specifiedFile) {
    // this is being called like: eslint-find-new-rules eslint-config-mgol
    if (isAbsolute(specifiedFile)) {
      return specifiedFile
    } else {
      return path.join(process.cwd(), specifiedFile)
    }
  } else {
    // this is not being called with an arg. Use the package.json `main`
    return require(path.join(process.cwd(), 'package.json')).main
  }
}

function getConfig(specifiedFile) {
  var configFile = getConfigFile(specifiedFile)
  var cliEngine = new eslint.CLIEngine({
    // ignore any config applicable depending on the location on the filesystem
    useEslintrc: false,
    // point to the particular config
    configFile: configFile, // eslint-disable-line object-shorthand
  })
  return cliEngine.getConfigForFile()
}

function getCurrentRules(conf) {
  var rules = Object.keys(conf.rules)
  return rules
}

function getPluginRules(conf) {
  var rules = []
  var plugins = conf.plugins
  if (plugins) {
    plugins.forEach(function normalizePluginRule(plugin) {
      var thisPluginsConfig = require('eslint-plugin-' + plugin)
      var thisPluginsRules = thisPluginsConfig.rules
      /* istanbul ignore next */
      if (typeof thisPluginsRules === 'object') {
        rules = rules.concat(
          Object.keys(thisPluginsRules).map(function mapPluginNames(rule) {
            return plugin + '/' + rule
          })
        )
      }
    })
  }
  return rules
}

module.exports = {
  getConfig: getConfig, // eslint-disable-line object-shorthand
  getCurrentRules: getCurrentRules, // eslint-disable-line object-shorthand
  getPluginRules: getPluginRules, // eslint-disable-line object-shorthand
}
