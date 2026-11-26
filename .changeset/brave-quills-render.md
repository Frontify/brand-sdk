---
"@frontify/guideline-blocks-settings": minor
---

feat!: move `RichTextEditor` to the 1.0 rich text editor

`RichTextEditor` and its read-only view now use `@frontify/fondue/rich-text-editor` (Fondue 14.0.0-rc.3 or later). The stored value does not change: `value` and `onTextChange` are still legacy Slate JSON. The editor reads the value through `convertLegacyRichText` and writes it through `toLegacyRichText`.

`plugins` is now a list of Fondue plugins. Change the preset calls:

```tsx
import { getDefaultPluginsWithLinkChooser, getTitlePlugins, RichTextEditor } from '@frontify/guideline-blocks-settings';

<RichTextEditor isEditing value={value} onTextChange={save} plugins={getDefaultPluginsWithLinkChooser(appBridge)} />
<RichTextEditor isEditing value={title} onTextChange={saveTitle} plugins={getTitlePlugins()} />
```

To build your own set, add the configured parts to Fondue plugins:

```tsx
import { boldPlugin, bulletListPlugin, italicPlugin } from '@frontify/fondue/rich-text-editor/plugins';
import { TextStylePluginsWithoutImage, bulletListLook, getLinkPlugin } from '@frontify/guideline-blocks-settings';

const plugins = [
    ...TextStylePluginsWithoutImage,
    boldPlugin(),
    italicPlugin(),
    getLinkPlugin({ appBridge, kinds: ['text', 'button'] }),
    bulletListPlugin({ look: bulletListLook }),
];
```

Changes:

- `getDefaultPluginsWithLinkChooser(appBridge)` returns a Fondue plugin list. The new `getTitlePlugins(textStylePlugins = AllTextStylePlugins)` returns the short title set with no links.
- `TextStylePluginsWithoutImage` and `AllTextStylePlugins` are now Fondue plugin lists: the text style plugin with the theme looks, and the quote plugin.
- New: `getLinkPlugin({ appBridge, kinds })`, and the looks `textStyleLook`, `linkLook`, `bulletListLook` and `numberedListLook`. Each look reads the same `--f-theme-settings-*` variables as before.
- `getLinkPlugin` searches link targets through the app-bridge `getLinkDestinations` method. Until the host implements it, the link form shows that the search failed, and authors can still type an address.
- New prop `showToolbar` (default `true`). Set it to `false` in place of `new PluginComposer({ noToolbar: true })`. The editor keeps every plugin's shortcuts and typing rules.
- `columns` and `gap` now add Fondue's column break. Remove `BreakAfterPlugin` from your plugins.
- Removed, with their replacements: `LinkPlugin` and `ButtonPlugin` (use `getLinkPlugin`), `UnorderedListPlugin` and `OrderedListPlugin` (use Fondue's `bulletListPlugin({ look: bulletListLook })` and `numberedListPlugin({ look: numberedListLook })`), `BreakAfterPlugin` (use `columns`), and `TextStylesWithoutImage` and `AllTextStyles` (Fondue's `alignPlugin()` needs no list).
- Removed with no replacement, because they only served the legacy editor: the single text style plugins (`Heading1Plugin` and the others), the link and button modal components and their hooks and transforms, `FloatingToolbarStyles`, `KEY_ELEMENT_BREAK_AFTER_COLUMN`, `GAP_DEFAULT`, `getUrl`, `getLegacyUrl`, `getLinkFromEditor` and `getUrlFromLinkOrLegacyLink`.
- `TextStyles`, `BlockStyles` and `BlockButtonStyles` stay.
- Links keep their underline. The `--f-theme-settings-link-text-decoration` variable no longer applies, because a link must not be told apart by colour alone (WCAG 1.4.1).

The editor never writes back a value that it cannot carry without loss. These values are shown read-only in edit mode:

- a value whose conversion needs a review (for example a link with an unsafe address, a link whose two stored addresses differ, or an element the new editor does not have);
- a value with content that the mounted plugins cannot hold;
- an HTML or plain text value, shown as the editor reads that HTML;
- a value that uses a type name of the new format for an element it cannot convert, or that is larger than the converter's limits (5 MiB, 50,000 nodes, 64 levels or 1,000,000 characters in one text): only its text is shown, one paragraph for each top-level element.

A value that is not a legacy value (JSON that is not an array, or an array with an entry that is not a text or an element) shows nothing, as before.

When an edit has no legacy form (for example a to-do item marked as in progress, a column break at the start or right after another one, or a list inside a to-do item), the editor does not save it. It marks the field as invalid, shows a message under it, and keeps the page's warning about unsaved changes until the author removes that content.
