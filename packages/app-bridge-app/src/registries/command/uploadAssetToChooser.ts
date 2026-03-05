/* (c) Copyright Frontify Ltd., all rights reserved. */

/**
 * Payload for the `uploadAssetToChooser` command.
 *
 * **Important:** This command only works when the user has the Asset Chooser open.
 * It relies on the Asset Chooser's events to place the asset at the location
 * where the Asset Chooser was opened.
 */
export type UploadAssetToChooserPayload = { data: File | Blob | string; filename: string };
