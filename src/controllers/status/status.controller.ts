function statusController (dependencies: any) {
  const _utilities = dependencies.utilities

  const get = async (data: any) => {
    return _utilities.response.success('API is online')
  }

  return {
    get
  }
}

module.exports = statusController
