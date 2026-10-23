---
"@frontify/app-bridge": major
---

fix: publish complete type declarations

The published types used a `Nullable` type that the package didn't ship. Fields such as `Asset.alternativeText` and `Color.revision.hex` were typed `any` in your project, or failed to compile without `skipLibCheck`. They now have their real types, such as `string | null`, so code that relied on `any` may need a `null` check.

Projects with `"moduleResolution": "node16"` or `"nodenext"` can now resolve the types. Before, every named import from `@frontify/app-bridge` failed to compile there.
