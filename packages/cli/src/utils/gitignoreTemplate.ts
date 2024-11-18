/* (c) Copyright Frontify Ltd., all rights reserved. */

export const gitignoreTemplate = {
    'platform-app': `
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
dist
dist-ssr
*.localdist
.idea
.vscode

# Editor directories and files
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?
.secret.json
`,
    'content-block': `
node_modules
dist
.idea
.vscode
`,
};
