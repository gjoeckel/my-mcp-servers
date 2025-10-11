import { google } from 'googleapis';
export class SimpleAppsScriptClient {
    script;
    auth;
    constructor(auth) {
        this.auth = auth;
        this.script = google.script({ version: 'v1', auth });
    }
    async getProject(scriptId) {
        try {
            const [projectResponse, contentResponse] = await Promise.all([
                this.script.projects.get({ scriptId }),
                this.script.projects.getContent({ scriptId })
            ]);
            const project = projectResponse.data;
            const content = contentResponse.data;
            return {
                scriptId: project.scriptId || '',
                title: project.title || '',
                createTime: project.createTime || '',
                updateTime: project.updateTime || '',
                files: (content.files || []).map((file) => ({
                    name: file.name || '',
                    type: file.type || 'SERVER_JS',
                    source: file.source || ''
                }))
            };
        }
        catch (error) {
            throw new Error(`Failed to get project ${scriptId}: ${error.message}`);
        }
    }
    async updateProject(scriptId, files) {
        try {
            const requestBody = {
                files: files.map(file => ({
                    name: file.name,
                    type: file.type,
                    source: file.source
                }))
            };
            const response = await this.script.projects.updateContent({
                scriptId,
                requestBody
            });
            const project = response.data;
            return {
                scriptId: project.scriptId || '',
                title: project.title || '',
                createTime: project.createTime || '',
                updateTime: project.updateTime || '',
                files: (project.files || []).map((file) => ({
                    name: file.name || '',
                    type: file.type || 'SERVER_JS',
                    source: file.source || ''
                }))
            };
        }
        catch (error) {
            throw new Error(`Failed to update project ${scriptId}: ${error.message}`);
        }
    }
    async executeFunction(scriptId, functionName, parameters = [], devMode = true) {
        try {
            const requestBody = {
                function: functionName,
                parameters,
                devMode
            };
            const response = await this.script.scripts.run({
                scriptId,
                requestBody
            });
            return response.data;
        }
        catch (error) {
            throw new Error(`Failed to execute function ${functionName} in ${scriptId}: ${error.message}`);
        }
    }
}
//# sourceMappingURL=simple-api-client.js.map