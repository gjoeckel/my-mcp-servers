import { OAuth2Client } from 'google-auth-library';
export interface AppsScriptFile {
    name: string;
    type: 'SERVER_JS' | 'HTML' | 'JSON';
    source: string;
}
export interface ProjectContent {
    scriptId: string;
    title: string;
    createTime: string;
    updateTime: string;
    files: AppsScriptFile[];
}
export declare class SimpleAppsScriptClient {
    private script;
    private auth;
    constructor(auth: OAuth2Client);
    getProject(scriptId: string): Promise<ProjectContent>;
    updateProject(scriptId: string, files: AppsScriptFile[]): Promise<ProjectContent>;
    executeFunction(scriptId: string, functionName: string, parameters?: any[], devMode?: boolean): Promise<any>;
}
//# sourceMappingURL=simple-api-client.d.ts.map