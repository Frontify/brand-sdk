/* (c) Copyright Frontify Ltd., all rights reserved. */

/* (c) Copyright Frontify Ltd., all rights reserved. */
import { Token, authorize } from '@frontify/frontify-authenticator';
import {
    ApolloClient,
    ApolloQueryResult,
    FetchResult,
    InMemoryCache,
    NormalizedCacheObject,
    OperationVariables,
    createHttpLink,
    gql,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

// Define all the different App types with their props
type AppContextProps =
    | {
          assetId: string;
          projectId: string; // either library project
          type: 'ASSET_ACTION';
          clientId: string;
          scopes: string; // JSON stringify
          domain: string;
          directory: string; // JSON stringify
      }
    | {
          downloadUrl: string;
          projectId: number;
          type: 'ASSET_CREATION';
          clientId: string;
      };

// Define all different commands with the needed parameters
type CommandProps =
    | {
          type: 'OPEN_DROPDOWN';
          params: { id: number; value: string };
      }
    | {
          type: 'CLOSE_DROPDOWN';
          params: { id: number; type: string };
      };

type oAuthClient = {
    clientId?: string;
    domain?: string;
    scopes?: string;
};

type OAuthClientEntries = Array<[keyof oAuthClient, oAuthClient[keyof oAuthClient]]>;

interface PlatformAppBridge {
    /**
     * Perform Queries against the Public Api
     * with seamless authentication
     * @param query
     */
    get<T>(query: string): Promise<ApolloQueryResult<T>>;

    /**
     * Run a mutation against the Public Api
     * with seamless Auth
     * @param mutation
     * @param variables
     */
    mutate<T>(mutation: string, variables: OperationVariables): Promise<FetchResult<T>>;

    /**
     * Get information about where the app is currently displayed, that depends on the type of the feature
     * AppContextProps returns all optional Parameters or a generic can be used
     */
    context(): AppContextProps;

    /**
     * Invoke a command on the parent Frontify client.
     * @param command
     */
    command(command: CommandProps): void;
}

/**
 * Initialize and get Token
 * Uses Apollo Client that brings efficient data fetching,
 * declarative data management, real-time updates
 */
export class AppBridgePlatformApp implements PlatformAppBridge {
    private client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
        cache: new InMemoryCache(),
    });
    private token?: Token;

    constructor() {
        // TODO: Impl passing of token
        this.initialize().catch((error) => console.warn('error', error));
    }

    public command(command: CommandProps) {
        console.log('Do', command.type);
        console.log('with params', command.params);
    }

    public context(): AppContextProps {
        return Object.fromEntries(new URLSearchParams(window.location.search)) as unknown as AppContextProps;
    }

    public async get<T>(query: string) {
        const queryNode = gql`
            ${query}
        `;
        return await this.client?.query<T>({ query: queryNode });
    }

    public async mutate<T>(mutation: string, variables: OperationVariables) {
        const mutationQuery = gql`
            ${mutation}
        `;
        const { mutate } = this.client;

        return await mutate<T>({
            mutation: mutationQuery,
            variables,
        });
    }

    private async initialize() {
        // Todo: use the token from QueryParams
        const token = localStorage.getItem('token');

        if (!token) {
            const queryStrings = Object.fromEntries(
                new URLSearchParams(window.location.search) as unknown as OAuthClientEntries,
            ) as oAuthClient;

            if (!!queryStrings.clientId && !!queryStrings.domain && !!queryStrings.scopes) {
                // Workaround: lets query the token once
                this.token = await authorize({
                    domain: queryStrings.domain,
                    clientId: queryStrings.clientId,
                    scopes: JSON.parse(queryStrings.scopes),
                });
                localStorage.setItem('token', JSON.stringify(this.token));
            }
        } else {
            this.token = JSON.parse(token);
        }

        if (!!this.token) {
            this.client = this.createApolloClient(this.token);
        }
    }

    private createApolloClient(token: Token) {
        const httpLink = createHttpLink({
            uri: `https://${token.bearerToken.domain}/graphql`,
        });

        const authLink = setContext((_, { headers }) => ({
            headers: {
                ...headers,
                authorization: `Bearer ${token.bearerToken.accessToken}`,
            },
        }));

        return new ApolloClient({
            link: authLink.concat(httpLink),
            cache: new InMemoryCache(),
        });
    }
}
