/* istanbul ignore file: ignore from coverage because it varies per eslint version */

/* eslint-disable import/no-unresolved */

let eslintNaming;

function _getNormalizer() {
  if (eslintNaming) {
    return eslintNaming;
  }

  const eslintVersionFunctions = [
    // eslint >= 6.1.0
    function () {
      const normalizer = require('eslint/lib/shared/naming');

      return {
        normalizePackageName: normalizer.normalizePackageName,
        getShorthandName: normalizer.getShorthandName
      };
    },
    // eslint 6.0.0 - 6.0.1
    function () {
      const normalizer = require('eslint/lib/cli-engine/naming');

      return {
        normalizePackageName: normalizer.normalizePackageName,
        getShorthandName: normalizer.getShorthandName
      };
    },
    // eslint 5
    function () {
      const normalizer = require('eslint/lib/util/naming');

      return {
        normalizePackageName: normalizer.normalizePackageName,
        getShorthandName: normalizer.getShorthandName
      };
    },
    // eslint 4
    function () {
      const normalizer = require('eslint/lib/util/naming');

      return {
        normalizePackageName: normalizer.normalizePackageName,
        getShorthandName: normalizer.removeNamespaceFromTerm
      };
    },
    // eslint 3
    function () {
      const normalizer = require('eslint/lib/config/plugins');

      const PLUGIN_NAME_PREFIX = 'eslint-plugin-';

      function parsePluginName(pluginName) {
        const pluginNamespace = normalizer.getNamespace(pluginName);
        const pluginNameWithoutNamespace = normalizer.removeNamespace(pluginName);
        const pluginNameWithoutPrefix = normalizer.removePrefix(pluginNameWithoutNamespace);

        return {
          pluginNamespace,
          pluginNameWithoutPrefix
        };
      }

      function normalizePackageName(pluginName) {
        const sections = parsePluginName(pluginName);
        const longName = sections.pluginNamespace +
          PLUGIN_NAME_PREFIX +
          sections.pluginNameWithoutPrefix;

        return longName;
      }

      function getShorthandName(pluginName) {
        const sections = parsePluginName(pluginName);
        const shortName = sections.pluginNamespace + sections.pluginNameWithoutPrefix;

        return shortName;
      }

      return {
        normalizePackageName,
        getShorthandName
      };
    }
  ];

  for (const tryEslintVersion of eslintVersionFunctions) {
    try {
      const normalizer = tryEslintVersion();

      if (
        typeof normalizer.normalizePackageName === 'function' &&
        typeof normalizer.getShorthandName === 'function'
      ) {
        eslintNaming = {
          normalizePackageName: normalizer.normalizePackageName,
          getShorthandName: normalizer.getShorthandName
        };

        return eslintNaming;
      }
    } catch (err) {
    }
  }

  throw new Error('eslint naming functions not found');
}

function normalizePluginName(name) {
  const normalizer = _getNormalizer();

  const module = normalizer.normalizePackageName(name, 'eslint-plugin');
  const prefix = normalizer.getShorthandName(name, 'eslint-plugin');

  return {module, prefix};
}

module.exports = normalizePluginName;
