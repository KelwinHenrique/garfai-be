/**
 * Auth handlers index
 * 
 * Exports all authentication-related handler functions and router
 */

export { handleGoogleAuth } from './google-auth';
export { handleGoogleCallback } from './google-callback';
export { handleLoginSuccess } from './login-success';
export { handleLoginFailed } from './login-failed';
export { handleLogout } from './logout';
export { authRouter } from './router';
