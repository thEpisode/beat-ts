class PostgresqlManager {
  private _dependencies: any;
  private _console: any;
  private _credentials: any;

  constructor(dependencies: any) {
    this._dependencies = dependencies
    this._console = dependencies.console
    this._credentials = ''
  }

  setSettings () {
    this.setCredentials(this._dependencies.config.POSTGRESQL)

    this._console.success('PostgreSQL manager loaded')
  }

  getCredentials () {
    return this._credentials
  }

  setCredentials (credentials: any) {
    this._credentials = credentials
  }
}

export { PostgresqlManager }
