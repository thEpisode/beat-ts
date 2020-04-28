class SpacesManager {
  private _dependencies: any;
  private _console: any;
  private _credentials: any;
  
  constructor(dependencies: any) {
    this._dependencies = dependencies
    this._console = dependencies.console
    this._credentials = ''
  }

  setSettings (credentials: any) {
    this.setCredentials(credentials)
    this._console.success('Spaces manager loaded')
  }

  getCredentials () {
    return this._credentials
  }

  setCredentials (credentials: any) {
    this._credentials = credentials
  }
}

export { SpacesManager }
