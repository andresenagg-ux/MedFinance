const { auth } = require('express-oauth2-jwt-bearer');

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Environment variable ${name} is required for Auth0 authentication.`);
  }
  return value;
}

const createAuthMiddleware = ({ audience, domain } = {}) => {
  const resolvedAudience = audience || requireEnv('AUTH0_AUDIENCE');
  const resolvedDomain = domain || requireEnv('AUTH0_DOMAIN');

  return auth({
    audience: resolvedAudience,
    issuerBaseURL: `https://${resolvedDomain}/`,
    tokenSigningAlg: 'RS256',
  });
};

module.exports = createAuthMiddleware;
