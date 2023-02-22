/* (c) Copyright Frontify Ltd., all rights reserved. */

export const getCurrentUser = `query CurrentUser {
                  currentUser {
                      id
                      email
                      avatar
                      name
                  }
              }`;

export const getCurrentProjectAssets = (projectId: string) => `
        query WorkspaceProjectById {
          workspaceProject: node(id: "${window.btoa(
              unescape(encodeURIComponent(`{"identifier":${projectId},"type":"project"}`))
          )}") {
            type: __typename
    ... on Workspace {
            id
            name
            assets(page: 1, limit: 10) {
                total
                items {
                    id
                    title
                    tags {
                        value
                    }
                ... on Image {
                        previewUrl
                    }
                }
            }
        }
          }
        }
`;
