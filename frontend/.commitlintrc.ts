// cf. https://commitlint.js.org/reference/configuration.html

import defaultConfig from '@commitlint/config-conventional';
import type { UserConfig } from '@commitlint/types';

const config: UserConfig = {
  // cf. https://github.com/conventional-changelog/commitlint/tree/master/@commitlint/config-conventional
  extends: ['@commitlint/config-conventional'],
  // cf. https://commitlint.js.org/#/reference-rules
  rules: {
    'type-enum': [2, 'always', [...defaultConfig.rules['type-enum'][2], 'WIP']],
    'type-case': [2, 'always', ['lowercase', 'uppercase']],
    'subject-case': [2, 'always', 'sentence-case'],
    'body-case': [2, 'always', 'sentence-case'],
    'header-max-length': [2, 'always', 72],
  },
};

export default config;

// Run `pnpm commitlint --print-config` to see how it's configured.
