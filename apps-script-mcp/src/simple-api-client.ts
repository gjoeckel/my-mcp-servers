import { google } from 'googleapis';
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

export class SimpleAppsScriptClient {
  private script: any;
  private auth: OAuth2Client;

  constructor(auth: OAuth2Client) {
    this.auth = auth;
    this.script = google.script({ version: 'v1', auth });
  }

  async getProject(scriptId: string): Promise<ProjectContent> {
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
        files: (content.files || []).map((file: any) => ({
          name: file.name || '',
          type: (file.type as 'SERVER_JS' | 'HTML' | 'JSON') || 'SERVER_JS',
          source: file.source || ''
        }))
      };
    } catch (error: any) {
      throw new Error(`Failed to get project ${scriptId}: ${error.message}`);
    }
  }

  async updateProject(scriptId: string, files: AppsScriptFile[]): Promise<ProjectContent> {
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
        files: (project.files || []).map((file: any) => ({
          name: file.name || '',
          type: (file.type as 'SERVER_JS' | 'HTML' | 'JSON') || 'SERVER_JS',
          source: file.source || ''
        }))
      };
    } catch (error: any) {
      throw new Error(`Failed to update project ${scriptId}: ${error.message}`);
    }
  }

  async executeFunction(scriptId: string, functionName: string, parameters: any[] = [], devMode: boolean = true): Promise<any> {
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
    } catch (error: any) {
      throw new Error(`Failed to execute function ${functionName} in ${scriptId}: ${error.message}`);
    }
  }
}