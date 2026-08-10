# @tailor-cms/ce-html-raw-display

End-user component for the **Raw HTML** content element in [Tailor CMS](https://github.com/tailor-cms/author).

Renders the element as learners see it in published content.

## Installation

```sh
npm install @tailor-cms/ce-html-raw-display
```

## Usage

Content elements are normally registered with Tailor through the element
registry rather than imported directly, but the package can be consumed on its
own:

```ts
import { Display } from '@tailor-cms/ce-html-raw-display';
```

## Element

| Property | Value |
| --- | --- |
| Name | Raw HTML |
| Type | `HTML_RAW` |
| Icon | [`mdi-code-tags`](https://pictogrammers.com/library/mdi/) |
| Composite | No |

## Packages

This element ships as four packages, published together from the
[`ce-html-raw`](https://github.com/tailor-cms/ce-html-raw) repository:

| Package | Role |
| --- | --- |
| [`@tailor-cms/ce-html-raw-manifest`](https://www.npmjs.com/package/@tailor-cms/ce-html-raw-manifest) | Shared element definition |
| [`@tailor-cms/ce-html-raw-edit`](https://www.npmjs.com/package/@tailor-cms/ce-html-raw-edit) | Authoring component |
| [`@tailor-cms/ce-html-raw-display`](https://www.npmjs.com/package/@tailor-cms/ce-html-raw-display) | End-user component |
| [`@tailor-cms/ce-html-raw-server`](https://www.npmjs.com/package/@tailor-cms/ce-html-raw-server) | Server-side module |

## Development

```sh
pnpm install
pnpm dev     # start the Content Element Kit runtime
pnpm build   # build all packages
pnpm test    # Playwright end-to-end suite
```

Changes are released with [changesets](https://github.com/changesets/changesets);
run `pnpm changeset` to record one.
