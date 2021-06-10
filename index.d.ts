interface Manifest {
    appId: string;
}

interface PackageJson {
    name: string;
    version: string;
    main: string;
}

declare module "esbuild-css-modules-plugin";
