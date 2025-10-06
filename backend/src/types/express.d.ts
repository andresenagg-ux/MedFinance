import type { User } from '../services/userService';

declare module 'express-serve-static-core' {
  interface ResponseLocals {
    authenticatedUser?: User;
  }
}
