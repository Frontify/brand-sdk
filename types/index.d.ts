/* eslint-disable @typescript-eslint/no-explicit-any */

export interface Asset {
    download_url: string;
    generic_url: string;
    id: number;
    preview_url: string;
}

export interface AssetChooserFilter {
    inverted?: boolean;
    key: string;
    values: string[];
}

export interface AssetChooserOptions {
    filters: AssetChooserFilter[];
    multiSelectionAllowed?: boolean;
}

export interface AssetChooserResult {
    collectionData: any[];
    externalData: { id: number; action: { id: string; data?: any } };
    screenData: Asset[];
    screenIds: number[];
}

export interface AssetChooser {
    open: (assetChooserOptions?: AssetChooserOptions, action?: { id: string; data?: any }) => void;
    chosen: (data: AssetChooserResult) => void;
}

export interface Project {
    id: number;
}

export interface Context {
    project: Project;
}

export interface Editor {
    editingEnabled: () => boolean;
    onEditingEnabledToggled: (enabled: boolean) => void;
}

export interface HttpClient {
    get: <T>(url: string, options?: Record<string, unknown>) => Promise<T>;
}
