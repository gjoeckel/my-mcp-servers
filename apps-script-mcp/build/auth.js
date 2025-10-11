import { google } from 'googleapis';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { homedir } from 'os';
export class AppsScriptAuth {
    oauth2Client;
    config;
    tokenData = null;
    constructor() {
        this.config = this.loadConfig();
        this.oauth2Client = new google.auth.OAuth2(this.config.clientId, this.config.clientSecret, this.config.redirectUri);
    }
    loadConfig() {
        const configPath = join(homedir(), '.apps-script-mcp', 'config.json');
        if (!existsSync(configPath)) {
            // Create default config
            const configDir = dirname(configPath);
            if (!existsSync(configDir)) {
                mkdirSync(configDir, { recursive: true });
            }
            const defaultConfig = {
                clientId: '1072944905499-vm2v2i5dvn0a0d2o4ca36i1vge8cvbn0.apps.googleusercontent.com',
                clientSecret: 'GOCSPX-PLACEHOLDER_CLIENT_SECRET',
                redirectUri: 'http://localhost:3000/oauth2callback',
                tokenPath: join(homedir(), '.apps-script-mcp', 'tokens.json')
            };
            writeFileSync(configPath, JSON.stringify(defaultConfig, null, 2));
            return defaultConfig;
        }
        return JSON.parse(readFileSync(configPath, 'utf8'));
    }
    loadTokens() {
        if (!existsSync(this.config.tokenPath)) {
            return null;
        }
        try {
            return JSON.parse(readFileSync(this.config.tokenPath, 'utf8'));
        }
        catch (error) {
            console.error('Error loading tokens:', error);
            return null;
        }
    }
    saveTokens(tokens) {
        const tokenDir = dirname(this.config.tokenPath);
        if (!existsSync(tokenDir)) {
            mkdirSync(tokenDir, { recursive: true });
        }
        writeFileSync(this.config.tokenPath, JSON.stringify(tokens, null, 2));
    }
    async authenticate() {
        // Try to load existing tokens
        this.tokenData = this.loadTokens();
        if (this.tokenData) {
            this.oauth2Client.setCredentials(this.tokenData);
            // Check if token is expired
            if (this.tokenData.expiry_date && Date.now() >= this.tokenData.expiry_date) {
                try {
                    const { credentials } = await this.oauth2Client.refreshAccessToken();
                    this.tokenData = {
                        ...this.tokenData,
                        access_token: credentials.access_token || this.tokenData.access_token,
                        refresh_token: credentials.refresh_token || this.tokenData.refresh_token,
                        expiry_date: credentials.expiry_date || this.tokenData.expiry_date
                    };
                    this.saveTokens(this.tokenData);
                    this.oauth2Client.setCredentials(this.tokenData);
                }
                catch (error) {
                    console.error('Error refreshing token:', error);
                    // Fall through to re-authentication
                }
            }
            return this.oauth2Client;
        }
        // If no tokens or refresh failed, need to authenticate
        throw new Error('No valid authentication found. Please run authentication flow.');
    }
    async getAuthUrl() {
        const scopes = [
            'https://www.googleapis.com/auth/script.projects',
            'https://www.googleapis.com/auth/script.deployments',
            'https://www.googleapis.com/auth/drive.file',
            'https://www.googleapis.com/auth/drive.metadata.readonly'
        ];
        return this.oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: scopes,
            prompt: 'consent'
        });
    }
    async handleCallback(code) {
        try {
            const { tokens } = await this.oauth2Client.getToken(code);
            this.tokenData = {
                access_token: tokens.access_token || '',
                refresh_token: tokens.refresh_token || '',
                scope: tokens.scope || '',
                token_type: tokens.token_type || 'Bearer',
                expiry_date: tokens.expiry_date || 0
            };
            this.saveTokens(this.tokenData);
            this.oauth2Client.setCredentials(this.tokenData);
            return this.oauth2Client;
        }
        catch (error) {
            throw new Error(`Authentication failed: ${error}`);
        }
    }
    async getAuthenticatedClient() {
        return await this.authenticate();
    }
    isAuthenticated() {
        return this.tokenData !== null &&
            this.tokenData.access_token !== '' &&
            (this.tokenData.expiry_date === 0 || Date.now() < this.tokenData.expiry_date);
    }
}
//# sourceMappingURL=auth.js.map