function requireEnv(name) {
  const value = process.env[name]?.trim()

  if (!value) {
    throw new Error(`${name} must be configured`)
  }

  return value
}

function getAuthConfig() {
  return {
    jwtSecret: requireEnv('JWT_SECRET'),
  }
}

module.exports = {
  requireEnv,
  getAuthConfig,
}
