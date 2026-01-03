export interface AppConfig {
  id: string;
  name: string;
  description: string;
  port: number;
  color: string;
  path: string;
}

export interface AppStatus {
  appId: string;
  status: 'running' | 'stopped' | 'error';
  pid?: number;
  exitCode?: number;
}

export interface AppStats {
  appId: string;
  cpu: number;
  memory: number; // in bytes
}

export type LogMessage = {
  appId: string;
  data: string;
};
