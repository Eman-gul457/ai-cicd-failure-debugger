export type DeploymentStatus = 'pending' | 'success' | 'failed' | 'rolled_back';
export type DeploymentEnvironment = 'staging' | 'production';
export type DeploymentService = 'api' | 'worker' | 'web';

export interface DeploymentRecord {
  id: string;
  service: DeploymentService;
  environment: DeploymentEnvironment;
  status: DeploymentStatus;
  commitSha: string;
  createdAt: string;
}

export const deploymentRecords: DeploymentRecord[] = [
  {
    id: 'dep_20260424_001',
    service: 'api',
    environment: 'staging',
    status: 'success',
    commitSha: '4f7c1ab',
    createdAt: '2026-04-24T08:30:00.000Z',
  },
  {
    id: 'dep_20260424_002',
    service: 'worker',
    environment: 'production',
    status: 'failed',
    commitSha: '9c12de4',
    createdAt: '2026-04-24T09:10:00.000Z',
  },
  {
    id: 'dep_20260424_003',
    service: 'web',
    environment: 'staging',
    status: 'pending',
    commitSha: '1ab89ef',
    createdAt: '2026-04-24T09:45:00.000Z',
  },
];
