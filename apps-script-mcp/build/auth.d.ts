import { OAuth2Client } from 'google-auth-library';
export interface TokenData {
    access_token: string;
    refresh_token: string;
    scope: string;
    token_type: string;
    expiry_date: number;
}
export interface AuthConfig {
    clientId: string;
    clientSecret: string;
    redirectUri: string;
    tokenPath: string;
}
export declare class AppsScriptAuth {
    private oauth2Client;
    private config;
    private tokenData;
    constructor();
    private loadConfig;
    private loadTokens;
    private saveTokens;
    authenticate(): Promise<OAuth2Client>;
    getAuthUrl(): Promise<string>;
    handleCallback(code: string): Promise<OAuth2Client>;
    getAuthenticatedClient(): Promise<OAuth2Client>;
    isAuthenticated(): boolean;
}
//# sourceMappingURL=auth.d.ts.map