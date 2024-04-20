// cf. https://github.com/faker-js/faker

// cf. https://fakerjs.dev/guide/localization.html#individual-localized-packages
import { faker as baseFaker } from '@faker-js/faker/locale/ja';

// cf. https://fakerjs.dev/guide/usage.html#reproducible-results
baseFaker.seed(1);

export const faker = baseFaker;
