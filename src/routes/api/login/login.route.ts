function loginRoute (dependencies:any) {
  const _utilities = dependencies.utilities
  const _database = dependencies.database

  /**
     * Login user
     *
     * route to show message (POST http://<<URL>>/api/login/:id)
     */
  const user = async (req:any, res:any) => {
    if (req.body) {
      const result = await _database.entities.login.user(req.body)

      res.json(result)
    } else {
      return _utilities.response.error('Please provide required data')
    }
  }

  const logout = async (req:any, res:any) => {
    const result = await _database.entities.login.logout()

    res.json(result)
  }

  return {
    user,
    logout
  }
}

module.exports = loginRoute
