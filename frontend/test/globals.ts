// In test (`jest-environment-jsdom`) env, `structuredClone is not defined`.
// Define an alternative to resolve it.
// cf. https://github.com/jsdom/jsdom/issues/3363#issuecomment-1221060809
// => https://developer.mozilla.org/en-US/docs/Glossary/Deep_copy
if (!global.structuredClone) {
  console.log('structuredClone is not defined. An alternative is used.');

  global.structuredClone = <T>(value: T): T => {
    return JSON.parse(JSON.stringify(value));
  };
}

export {};
