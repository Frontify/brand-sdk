/* (c) Copyright Frontify Ltd., all rights reserved. */

import { beforeEach, describe, expect, test, vi } from 'vitest';

import pkg from '../../package.json';

vi.mock('vite', () => ({
    createServer: vi.fn(),
}));

vi.mock('../../src/utils/getPackageVersion', () => ({
    getAppBridgeVersion: vi.fn(),
    getReactVersion: vi.fn(),
}));

vi.mock('../../src/utils/readContentBlockManifest', () => ({
    readContentBlockManifest: vi.fn(),
}));

vi.mock('../../src/utils/vitePlugins', () => ({
    reactBareExternalPlugin: vi.fn(() => ({ name: 'mock-plugin' })),
}));

const { createServer } = await import('vite');
const { getAppBridgeVersion, getReactVersion } = await import('../../src/utils/getPackageVersion');
const { readContentBlockManifest } = await import('../../src/utils/readContentBlockManifest');
const { BlockDevelopmentServer } = await import('../../src/servers/blockDevelopmentServer');

type Handler = (req: { url?: string; headers: Record<string, string> }, res: MockResponse, next: () => void) => void;

type MockResponse = {
    setHeader: ReturnType<typeof vi.fn>;
    writeHead: ReturnType<typeof vi.fn>;
    end: ReturnType<typeof vi.fn>;
};

const createMockResponse = (): MockResponse => ({
    setHeader: vi.fn(),
    writeHead: vi.fn(),
    end: vi.fn(),
});

type ResponseBody = {
    url: string;
    entryFilePath: string;
    port: number;
    version: string;
    dependencies: Record<string, string>;
    manifest?: Record<string, unknown>;
};

const parseBody = (res: MockResponse): ResponseBody => JSON.parse(res.end.mock.calls[0][0] as string) as ResponseBody;

const setupServer = async () => {
    const handlers = new Map<string, Handler>();
    const fakeViteServer = {
        middlewares: {
            use: vi.fn((path: string, handler: Handler) => {
                handlers.set(path, handler);
            }),
        },
        listen: vi.fn().mockResolvedValue({ printUrls: vi.fn() }),
    };
    vi.mocked(createServer).mockResolvedValue(fakeViteServer as unknown as Awaited<ReturnType<typeof createServer>>);

    const server = new BlockDevelopmentServer('src/index.tsx', 5600, false);
    await server.serve();

    return { handlers };
};

describe('BlockDevelopmentServer', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(getAppBridgeVersion).mockReturnValue('1.2.3');
        vi.mocked(getReactVersion).mockReturnValue('18.0.0');
        vi.mocked(readContentBlockManifest).mockReturnValue(undefined);
    });

    describe('/_entrypoint', () => {
        test('should include the manifest in the response body when one is present', async () => {
            const manifest = { appId: 'block-1', appType: 'content-block' as const };
            vi.mocked(readContentBlockManifest).mockReturnValue(manifest);

            const { handlers } = await setupServer();
            const handler = handlers.get('/_entrypoint');
            const res = createMockResponse();

            handler?.({ url: '/', headers: { host: 'localhost:5600' } }, res, vi.fn());

            const body = parseBody(res);
            expect(body.manifest).toEqual(manifest);
        });

        test('should omit the manifest field when readContentBlockManifest returns undefined', async () => {
            vi.mocked(readContentBlockManifest).mockReturnValue(undefined);

            const { handlers } = await setupServer();
            const handler = handlers.get('/_entrypoint');
            const res = createMockResponse();

            handler?.({ url: '/', headers: { host: 'localhost:5600' } }, res, vi.fn());

            const body = parseBody(res);
            expect(body).not.toHaveProperty('manifest');
        });

        test('should return the entry url, port, version, and dependencies', async () => {
            const { handlers } = await setupServer();
            const handler = handlers.get('/_entrypoint');
            const res = createMockResponse();

            handler?.({ url: '/', headers: { host: 'example.test:7777' } }, res, vi.fn());

            const body = parseBody(res);
            expect(body).toEqual({
                url: 'http://example.test:7777/src/index.tsx',
                entryFilePath: 'src/index.tsx',
                port: 7777,
                version: pkg.version,
                dependencies: {
                    '@frontify/app-bridge': '1.2.3',
                    react: '18.0.0',
                },
            });
        });

        test('should fall back to the configured port when the host header has no port', async () => {
            const { handlers } = await setupServer();
            const handler = handlers.get('/_entrypoint');
            const res = createMockResponse();

            handler?.({ url: '/', headers: { host: 'example.test' } }, res, vi.fn());

            const body = parseBody(res);
            expect(body.port).toBe(5600);
        });

        test('should omit dependencies that are not resolvable', async () => {
            vi.mocked(getAppBridgeVersion).mockReturnValue(undefined);
            vi.mocked(getReactVersion).mockReturnValue(undefined);

            const { handlers } = await setupServer();
            const handler = handlers.get('/_entrypoint');
            const res = createMockResponse();

            handler?.({ url: '/', headers: { host: 'localhost:5600' } }, res, vi.fn());

            const body = parseBody(res);
            expect(body.dependencies).toEqual({});
        });

        test('should set CORS and JSON content-type headers', async () => {
            const { handlers } = await setupServer();
            const handler = handlers.get('/_entrypoint');
            const res = createMockResponse();

            handler?.({ url: '/', headers: { host: 'localhost:5600' } }, res, vi.fn());

            expect(res.setHeader).toHaveBeenCalledWith('Access-Control-Allow-Origin', '*');
            expect(res.setHeader).toHaveBeenCalledWith('Access-Control-Allow-Methods', 'GET, OPTIONS');
            expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
            expect(res.writeHead).toHaveBeenCalledWith(200);
        });

        test('should forward to next() when the request url is not "/"', async () => {
            const { handlers } = await setupServer();
            const handler = handlers.get('/_entrypoint');
            const res = createMockResponse();
            const next = vi.fn();

            handler?.({ url: '/something-else', headers: { host: 'localhost:5600' } }, res, next);

            expect(next).toHaveBeenCalled();
            expect(res.end).not.toHaveBeenCalled();
        });
    });
});
