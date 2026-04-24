function requireEnv(name) {
  const value = process.env[name]?.trim()

  if (!value) {
    throw new Error(`${name} must be configured`)
  }

  return value
}

function optionalEnv(name) {
  return process.env[name]?.trim() || ''
}

function getAuthConfig() {
  return {
    jwtSecret: requireEnv('JWT_SECRET'),
  }
}

function getAdminBootstrapConfig() {
  return {
    adminUsername: optionalEnv('ADMIN_USERNAME'),
    adminPassword: optionalEnv('ADMIN_PASSWORD'),
  }
}

module.exports = {
  requireEnv,
  optionalEnv,
  getAuthConfig,
  getAdminBootstrapConfig,
}
