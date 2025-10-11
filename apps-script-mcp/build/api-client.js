import { google } from 'googleapis';
export class AppsScriptApiClient {
    script;
    auth;
    constructor(auth) {
        this.auth = auth;
        this.script = google.script({ version: 'v1', auth });
    }
    async listProjects(pageSize = 50, pageToken, searchQuery) {
        try {
            // Note: The Apps Script API doesn't have a direct list endpoint
            // This is a simplified implementation that would need to be adapted
            // based on the actual API structure
            const response = await this.script.projects.get({
                scriptId: 'placeholder' // This would need to be implemented differently
            });
            // For now, return empty results with a note
            return {
                projects: [],
                nextPageToken: undefined
            };
        }
        catch (error) {
            throw new Error(`Failed to list projects: ${error.message}`);
        }
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
                files: (content.files || []).map(file => ({
                    name: file.name || '',
                    type: file.type || 'SERVER_JS',
                    source: file.source || ''
                })),
                manifest: content.manifest
            };
        }
        catch (error) {
            throw new Error(`Failed to get project ${scriptId}: ${error.message}`);
        }
    }
    async createProject(title, files = [], parentId) {
        try {
            const requestBody = {
                title,
                parentId
            };
            if (files.length > 0) {
                requestBody.files = files.map(file => ({
                    name: file.name,
                    type: file.type,
                    source: file.source
                }));
            }
            const response = await this.script.projects.create({
                requestBody
            });
            const project = response.data;
            return {
                scriptId: project.scriptId || '',
                title: project.title || '',
                createTime: project.createTime || '',
                updateTime: project.updateTime || '',
                files: (project.files || []).map(file => ({
                    name: file.name || '',
                    type: file.type || 'SERVER_JS',
                    source: file.source || ''
                })),
                manifest: project.manifest
            };
        }
        catch (error) {
            throw new Error(`Failed to create project: ${error.message}`);
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
                files: (project.files || []).map(file => ({
                    name: file.name || '',
                    type: file.type || 'SERVER_JS',
                    source: file.source || ''
                })),
                manifest: project.manifest
            };
        }
        catch (error) {
            throw new Error(`Failed to update project ${scriptId}: ${error.message}`);
        }
    }
    async createDeployment(scriptId, versionNumber, description, manifestFileName = 'appsscript') {
        try {
            const requestBody = {
                manifestFileName
            };
            if (versionNumber) {
                requestBody.versionNumber = versionNumber;
            }
            if (description) {
                requestBody.description = description;
            }
            const response = await this.script.projects.deployments.create({
                scriptId,
                requestBody
            });
            const deployment = response.data;
            return {
                deploymentId: deployment.deploymentId || '',
                versionNumber: deployment.versionNumber || 0,
                description: deployment.description || '',
                entryPoints: deployment.entryPoints || []
            };
        }
        catch (error) {
            throw new Error(`Failed to create deployment for ${scriptId}: ${error.message}`);
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
            const result = response.data;
            return {
                done: result.done || false,
                name: result.name || '',
                response: result.response,
                error: result.error
            };
        }
        catch (error) {
            throw new Error(`Failed to execute function ${functionName} in ${scriptId}: ${error.message}`);
        }
    }
    async getExecutionLogs(scriptId, limit = 100) {
        try {
            // Note: The Apps Script API doesn't have a direct logs endpoint
            // This would typically require using the Apps Script Execution API
            // or the Google Cloud Logging API for more detailed logs
            // For now, we'll return a placeholder response
            return [{
                    message: 'Execution logs require additional setup with Google Cloud Logging API',
                    timestamp: new Date().toISOString(),
                    level: 'INFO'
                }];
        }
        catch (error) {
            throw new Error(`Failed to get execution logs for ${scriptId}: ${error.message}`);
        }
    }
}
//# sourceMappingURL=api-client.js.map