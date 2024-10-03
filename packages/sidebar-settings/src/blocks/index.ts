/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type AssetInputBlock } from './assetInput';
import { type ChecklistBlock } from './checklist';
import { type ColorInputBlock } from './colorInput';
import { type DropdownBlock } from './dropdown';
import { type FontInputBlock } from './fontInput';
import { type InputBlock } from './input';
import { type LegacyAssetInputBlock } from './legacyAssetInput';
import { type LinkBlock } from './link';
import { type LinkChooserBlock } from './linkChooser';
import { type MultiInputBlock } from './multiInput';
import { type NotificationBlock } from './notification';
import { type SectionHeadingBlock } from './sectionHeading';
import { type SegmentedControlsBlock } from './segmentedControls';
import { type SwitchBlock } from './switch';
import { type TemplateInputBlock } from './templateInput';
import { type TextareaBlock } from './textarea';

type UnionOmit<T, K extends string | number | symbol> = T extends unknown ? Omit<T, K> : never;

export * from './assetInput';
export * from './base';
export * from './checkbox';
export * from './checklist';
export * from './choices';
export * from './colorInput';
export * from './dropdown';
export * from './fontInput';
export * from './input';
export * from './legacyAssetInput';
export * from './linkChooser';
export * from './multiInput';
export * from './notification';
export * from './sectionHeading';
export * from './segmentedControls';
export * from './switch';
export * from './templateInput';
export * from './textarea';
export * from './link';

export enum AssetChooserProjectType {
    MediaLibrary = 'MediaLibrary',
    LogoLibrary = 'LogoLibrary',
    IconLibrary = 'IconLibrary',
    DocumentLibrary = 'DocumentLibrary',
    TemplateLibrary = 'TemplateLibrary',
    Styleguide = 'Styleguide',
    Workspace = 'Workspace',
}

export enum AssetChooserObjectType {
    File = 'FILE', // Audio, Zip, ...
    Canvas = 'CANVAS',
    ImageVideo = 'IMAGE', // No distinction between images and videos in the screen table
    TextSnippet = 'TEXT_SNIPPET',
    Url = 'URL',
}

export enum FileExtension {
    Aac = 'aac',
    Ac3 = 'ac3',
    Ai = 'ai',
    Aif = 'aif',
    Aifc = 'aifc',
    Aiff = 'aiff',
    Artboard = 'artboard',
    Asc = 'asc',
    Atom = 'atom',
    Au = 'au',
    Avi = 'avi',
    Bcpio = 'bcpio',
    Bin = 'bin',
    Bmp = 'bmp',
    Cdf = 'cdf',
    Cgm = 'cgm',
    Class = 'class',
    Cpio = 'cpio',
    Cpt = 'cpt',
    Csh = 'csh',
    Css = 'css',
    Dcr = 'dcr',
    Dif = 'dif',
    Dir = 'dir',
    Djv = 'djv',
    Djvu = 'djvu',
    Dll = 'dll',
    Dmg = 'dmg',
    Dms = 'dms',
    Dng = 'dng',
    Doc = 'doc',
    Docx = 'docx',
    Dotx = 'dotx',
    Docm = 'docm',
    Dotm = 'dotm',
    Dtd = 'dtd',
    Dv = 'dv',
    Dvi = 'dvi',
    Dxr = 'dxr',
    Eps = 'eps',
    Etx = 'etx',
    Exe = 'exe',
    Ez = 'ez',
    Flac = 'flac',
    Flv = 'flv',
    Gif = 'gif',
    Gram = 'gram',
    Grxml = 'grxml',
    Gtar = 'gtar',
    Hdf = 'hdf',
    Heif = 'heif',
    Hqx = 'hqx',
    Htm = 'htm',
    Html = 'html',
    Ice = 'ice',
    Ico = 'ico',
    Ics = 'ics',
    Idml = 'idml',
    Ief = 'ief',
    Ifb = 'ifb',
    Iges = 'iges',
    Igs = 'igs',
    Indd = 'indd',
    Indt = 'indt',
    Jnlp = 'jnlp',
    Jp2 = 'jp2',
    Jpe = 'jpe',
    Jpeg = 'jpeg',
    Jpg = 'jpg',
    Js = 'js',
    Kar = 'kar',
    Latex = 'latex',
    Lha = 'lha',
    Lzh = 'lzh',
    M3u = 'm3u',
    M4a = 'm4a',
    M4b = 'm4b',
    M4p = 'm4p',
    M4r = 'm4r',
    M4u = 'm4u',
    M4v = 'm4v',
    Mac = 'mac',
    Man = 'man',
    Mathml = 'mathml',
    Me = 'me',
    Mesh = 'mesh',
    Mid = 'mid',
    Midi = 'midi',
    Mif = 'mif',
    Mkv = 'mkv',
    Mov = 'mov',
    Movie = 'movie',
    Mp2 = 'mp2',
    Mp3 = 'mp3',
    Mp4 = 'mp4',
    Mpe = 'mpe',
    Mpeg = 'mpeg',
    Mpg = 'mpg',
    Mpga = 'mpga',
    Ms = 'ms',
    Msh = 'msh',
    Mts = 'mts',
    Mxu = 'mxu',
    Nc = 'nc',
    Oda = 'oda',
    Ogg = 'ogg',
    Pbm = 'pbm',
    Pct = 'pct',
    Pdb = 'pdb',
    Pdf = 'pdf',
    Pgm = 'pgm',
    Pgn = 'pgn',
    Pic = 'pic',
    Pict = 'pict',
    Png = 'png',
    Pnm = 'pnm',
    Pnt = 'pnt',
    Pntg = 'pntg',
    Ppm = 'ppm',
    Ppt = 'ppt',
    Pptx = 'pptx',
    Potx = 'potx',
    Ppsx = 'ppsx',
    Ppam = 'ppam',
    Pptm = 'pptm',
    Potm = 'potm',
    Ppsm = 'ppsm',
    Ps = 'ps',
    Psd = 'psd',
    Qt = 'qt',
    Qti = 'qti',
    Qtif = 'qtif',
    Ra = 'ra',
    Ram = 'ram',
    Ras = 'ras',
    Rdf = 'rdf',
    Rgb = 'rgb',
    Rm = 'rm',
    Roff = 'roff',
    Rtf = 'rtf',
    Rtx = 'rtx',
    Sgm = 'sgm',
    Sgml = 'sgml',
    Sh = 'sh',
    Shar = 'shar',
    Silo = 'silo',
    Sit = 'sit',
    Skd = 'skd',
    Sketch = 'sketch',
    Skm = 'skm',
    Skp = 'skp',
    Skt = 'skt',
    Smi = 'smi',
    Smil = 'smil',
    Snd = 'snd',
    So = 'so',
    Spl = 'spl',
    Src = 'src',
    Sv4cpio = 'sv4cpio',
    Sv4crc = 'sv4crc',
    Svg = 'svg',
    Swf = 'swf',
    T = 't',
    Tar = 'tar',
    Tcl = 'tcl',
    Tex = 'tex',
    Texi = 'texi',
    Texinfo = 'texinfo',
    Tif = 'tif',
    Tiff = 'tiff',
    Tr = 'tr',
    Tsv = 'tsv',
    Txt = 'txt',
    Ustar = 'ustar',
    Vcd = 'vcd',
    Vrml = 'vrml',
    Vxml = 'vxml',
    Wav = 'wav',
    Wbmp = 'wbmp',
    Wbmxl = 'wbmxl',
    Webm = 'webm',
    Webp = 'webp',
    Wml = 'wml',
    Wmlc = 'wmlc',
    Wmls = 'wmls',
    Wmlsc = 'wmlsc',
    Wmv = 'wmv',
    Wrl = 'wrl',
    Xbm = 'xbm',
    Xht = 'xht',
    Xhtml = 'xhtml',
    Xls = 'xls',
    Xml = 'xml',
    Xpm = 'xpm',
    Xsl = 'xsl',
    Xlsx = 'xlsx',
    Xltx = 'xltx',
    Xlsm = 'xlsm',
    Xltm = 'xltm',
    Xlam = 'xlam',
    Xlsb = 'xlsb',
    Xslt = 'xslt',
    Xul = 'xul',
    Xwd = 'xwd',
    Xyz = 'xyz',
    Zip = 'zip',
    Tpl = 'tpl',
}

export enum FileType {
    Audio = 'audio',
    Documents = 'documents',
    Images = 'images',
    Videos = 'videos',
    Templates = 'templates',
}

export const FileExtensionSets: Record<keyof typeof FileType, FileExtension[]> = {
    Audio: [
        FileExtension.Aac,
        FileExtension.Ac3,
        FileExtension.Aif,
        FileExtension.Aifc,
        FileExtension.Aiff,
        FileExtension.Flac,
        FileExtension.M4a,
        FileExtension.M4r,
        FileExtension.Mp3,
        FileExtension.Ogg,
        FileExtension.Wav,
    ],
    Documents: [
        FileExtension.Doc,
        FileExtension.Docx,
        FileExtension.Dotx,
        FileExtension.Pdf,
        FileExtension.Potx,
        FileExtension.Ppt,
        FileExtension.Pptx,
        FileExtension.Xls,
        FileExtension.Xlsx,
        FileExtension.Xltx,
    ],
    Images: [
        FileExtension.Ai,
        FileExtension.Bmp,
        FileExtension.Dng,
        FileExtension.Eps,
        FileExtension.Gif,
        FileExtension.Heif,
        FileExtension.Ico,
        FileExtension.Jpeg,
        FileExtension.Jpg,
        FileExtension.Png,
        FileExtension.Psd,
        FileExtension.Svg,
        FileExtension.Tif,
        FileExtension.Tiff,
        FileExtension.Webp,
    ],
    Videos: [
        FileExtension.Avi,
        FileExtension.Flv,
        FileExtension.M4v,
        FileExtension.Mkv,
        FileExtension.Mov,
        FileExtension.Mp4,
        FileExtension.Mpg,
        FileExtension.Mts,
        FileExtension.Webm,
        FileExtension.Wmv,
    ],
    Templates: [
        FileExtension.Artboard,
        FileExtension.Idml,
        FileExtension.Indd,
        FileExtension.Indt,
        FileExtension.Sketch,
    ],
};

export { IconEnum } from '@frontify/fondue';

/**
 * @deprecated
 */
export enum AssetInputSize {
    Small = 'Small',
    Large = 'Large',
}

/**
 * @deprecated
 */
export enum SwitchSize {
    Small = 'Small',
    Medium = 'Medium',
}

/**
 * @deprecated
 */
export enum MultiInputLayout {
    Columns = 'Columns',
    Spider = 'Spider',
}

/**
 * @deprecated
 */
export enum DropdownSize {
    Small = 'Small',
    Large = 'Large',
}

/**
 * @deprecated
 */
export enum TextInputType {
    Text = 'text',
    Password = 'password',
    Number = 'number',
}

export type SimpleSettingBlock<AppBridge> =
    | AssetInputBlock<AppBridge>
    | ChecklistBlock<AppBridge>
    | ColorInputBlock<AppBridge>
    | DropdownBlock<AppBridge>
    | FontInputBlock<AppBridge>
    | InputBlock<AppBridge>
    | LegacyAssetInputBlock<AppBridge>
    | LinkChooserBlock<AppBridge>
    | LinkBlock<AppBridge>
    | MultiInputBlock<AppBridge>
    | NotificationBlock<AppBridge>
    | SectionHeadingBlock<AppBridge>
    | SegmentedControlsBlock<AppBridge>
    | SwitchBlock<AppBridge>
    | TemplateInputBlock<AppBridge>
    | TextareaBlock<AppBridge>;

export type DynamicSupportedBlock<AppBridge> =
    | InputBlock<AppBridge>
    | ColorInputBlock<AppBridge>
    | DropdownBlock<AppBridge>;

export type DynamicSettingBlock<
    AppBridge,
    T extends DynamicSupportedBlock<AppBridge> = DynamicSupportedBlock<AppBridge>,
> = UnionOmit<T, 'value'> & {
    value?: DynamicSupportedBlock<AppBridge>['value'][];
    dynamic: {
        addButtonLabel: string;
    };
};

export type SettingBlock<AppBridge> = SimpleSettingBlock<AppBridge> | DynamicSettingBlock<AppBridge>;
