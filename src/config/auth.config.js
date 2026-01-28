module.exports = {
  secret: process.env.ACCESS_TOKEN_SECRET || "access-token-secret-key",
  refreshSecret: process.env.REFRESH_TOKEN_SECRET || "refresh-token-secret-key",
  jwtExpiration: parseInt(process.env.ACCESS_TOKEN_EXPIRATION) || 9300,           // 155 minutes
  jwtRefreshExpiration: parseInt(process.env.REFRESH_TOKEN_EXPIRATION) || 10800, // 3 hours
};
