---
"@frontify/guideline-blocks-settings": minor
---

feat: add the 1.0 rich text editor as `@frontify/guideline-blocks-settings/rich-text-editor`

The new entry point holds a `RichTextEditor` built on `@frontify/fondue/rich-text-editor` (Fondue 14.0.0-rc.3 or later), and presets made of Fondue plugins. The legacy `RichTextEditor`, its presets and its plugins at the package root do not change. Its styles are a separate stylesheet, `@frontify/guideline-blocks-settings/rich-text-editor/styles`, so the root stylesheet does not change.

The stored value stays legacy Slate JSON: `value` and `onTextChange` are the same strings as before. The editor reads them through `convertLegacyRichText` and writes them through `toLegacyRichText`.

To move a block, change the import path and the preset calls:

```tsx
import { getDefaultPluginsWithLinkChooser, getTitlePlugins, RichTextEditor } from '@frontify/guideline-blocks-settings/rich-text-editor';

<RichTextEditor isEditing value={value} onTextChange={save} plugins={getDefaultPluginsWithLinkChooser(appBridge)} />
<RichTextEditor isEditing value={title} onTextChange={saveTitle} plugins={getTitlePlugins()} />
```

To build your own set, add the configured parts to Fondue plugins:

```tsx
import { boldPlugin, bulletListPlugin, italicPlugin } from '@frontify/fondue/rich-text-editor/plugins';
import { TextStylePluginsWithoutImage, bulletListLook, getLinkPlugin } from '@frontify/guideline-blocks-settings/rich-text-editor';

const plugins = [
    ...TextStylePluginsWithoutImage,
    boldPlugin(),
    italicPlugin(),
    getLinkPlugin({ appBridge, kinds: ['text', 'button'] }),
    bulletListPlugin({ look: bulletListLook }),
];
```

What the entry point holds:

- `RichTextEditor`, with the same props as the legacy one, except that `plugins` is a list of Fondue plugins. A new prop, `showToolbar` (default `true`), replaces `new PluginComposer({ noToolbar: true })`. The editor keeps every plugin's shortcuts and typing rules.
- `getDefaultPluginsWithLinkChooser(appBridge)`, `getTitlePlugins(textStylePlugins = AllTextStylePlugins)`, `getLinkPlugin({ appBridge, kinds })`, `TextStylePluginsWithoutImage`, `AllTextStylePlugins`, and the looks `textStyleLook`, `linkLook`, `bulletListLook` and `numberedListLook`. Each look reads the same `--f-theme-settings-*` variables as the legacy plugins.
- `columns` and `gap` add Fondue's column break, so a block does not add a column break plugin itself.
- `getLinkPlugin` searches link targets through the app-bridge `getLinkDestinations` method. Until the host implements it, the link form shows that the search failed, and authors can still type an address.
- Links keep their underline. The `--f-theme-settings-link-text-decoration` variable does not apply in the new editor, because a link must not be told apart by colour alone (WCAG 1.4.1).

The editor never writes back a value that it cannot carry without loss. These values are shown read-only in edit mode:

- a value whose conversion needs a review (for example a link with an unsafe address, a link whose two stored addresses differ, or an element the new editor does not have);
- a value with content that the mounted plugins cannot hold;
- an HTML or plain text value, shown as the editor reads that HTML.

A value that holds a block or inline type the mounted plugins do not register, or that the converter rejects (a type name of the new format used for another element, or a value over 5 MiB, 50,000 nodes, 64 levels or 1,000,000 characters in one text), shows only its text, one line per block. A value that is not a legacy value shows nothing, as before.

When an edit has no legacy form (for example a to-do item marked as in progress, a column break at the start or right after another one, or a list inside a to-do item), the editor does not save it. It marks the field as invalid, shows a message under it, and keeps the page's warning about unsaved changes until the author removes that content.
