// cf. https://nextjs.org/docs/pages/api-reference/config/typescript#custom-type-declarations

/** It overrides the type of `next/image-types/global.d.ts` in `next-env.d.ts`. */
declare module '*.svg' {
  const content: import('next/image').StaticImageData;

  export default content;
}
