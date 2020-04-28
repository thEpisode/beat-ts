function backendController (dependencies: any) {
  const _auth = dependencies.auth
  const _key = _auth.crypto.generatePrivateKey(dependencies.config.BACKEND_SECRET)

  const getKey = () => {
    return _key
  }

  return {
    getKey
  }
}

module.exports = backendController
