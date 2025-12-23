import { AsyncLocalStorage } from 'async_hooks';

export interface AsyncContext {
  requestId: string;
  userId?: string;
  timestamp: number;
}

export const asyncContext = new AsyncLocalStorage<AsyncContext>();

export function getContext(): AsyncContext | undefined {
  return asyncContext.getStore();
}

