function statusRoute (dependencies: any) {
  const _controllers = dependencies.controllers
  const _utilities = dependencies.utilities

  /**
     * Status
     *
     * route to show message (GET http://<<URL>>/api/status)
     */
  const get = async (req: any, res: any) => {
    const params = _utilities.request.getParameters(req)
    const result = await _controllers.status.get(params)

    res.json(result)
  }

  return {
    get
  }
}

module.exports = statusRoute
