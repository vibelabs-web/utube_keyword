import { keywordHandlers } from './keyword';
import { commentHandlers } from './comment';

export const handlers = [...keywordHandlers, ...commentHandlers];
