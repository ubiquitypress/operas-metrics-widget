import type { APIEvent } from '@/types';

export interface APIResponse {
  status: string;
  code: number;
  count: number;
  data: APIEvent[];
}
