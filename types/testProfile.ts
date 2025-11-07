import { UserProfile } from './tip';

export interface TestProfileDefinition {
  id: string;
  name: string;
  description: string;
  profile: UserProfile;
  createdAt: string;
  source: 'built-in' | 'custom';
}
