import { OAuth2Client } from 'google-auth-library';
export interface AppsScriptFile {
    name: string;
    type: 'SERVER_JS' | 'HTML' | 'JSON';
    source: string;
}
export interface ProjectInfo {
    scriptId: string;
    title: string;
    createTime: string;
    updateTime: string;
    creator: {
        name: string;
        email: string;
    };
    lastModifyUser: {
        name: string;
        email: string;
    };
    parentId?: string;
}
export interface ProjectContent {
    scriptId: string;
    title: string;
    createTime: string;
    updateTime: string;
    files: AppsScriptFile[];
    manifest: any;
}
export interface ExecutionResult {
    done: boolean;
    name: string;
    response?: any;
    error?: {
        code: number;
        message: string;
        details: any[];
    };
}
export declare class AppsScriptApiClient {
    private script;
    private auth;
    constructor(auth: OAuth2Client);
    listProjects(pageSize?: number, pageToken?: string, searchQuery?: string): Promise<{
        projects: ProjectInfo[];
        nextPageToken?: string;
    }>;
    getProject(scriptId: string): Promise<ProjectContent>;
    createProject(title: string, files?: AppsScriptFile[], parentId?: string): Promise<ProjectContent>;
    updateProject(scriptId: string, files: AppsScriptFile[]): Promise<ProjectContent>;
    createDeployment(scriptId: string, versionNumber?: number, description?: string, manifestFileName?: string): Promise<{
        deploymentId: string;
        versionNumber: number;
        description: string;
        entryPoints: any[];
    }>;
    executeFunction(scriptId: string, functionName: string, parameters?: any[], devMode?: boolean): Promise<ExecutionResult>;
    getExecutionLogs(scriptId: string, limit?: number): Promise<any[]>;
}
//# sourceMappingURL=api-client.d.ts.map