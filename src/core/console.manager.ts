class ConsoleManager {
  private _dependencies: any;
  private _colors: any;
  private _serverName: any;

  constructor(dependencies: any) {
    this._dependencies = dependencies
    this._colors = dependencies.colors
    this._serverName = dependencies.config.SERVER_NAME
  }

  code (body: any) {
    console.log(this._colors.grey(' > ') + (this._dependencies.isJsonString(body) === true ? JSON.stringify(body) : body))
  }

  log (body: any) {
    console.log(this._dependencies.isJsonString(body) === true ? JSON.stringify(body) : body)
  }

  error (body: any, ignoreStack = false) {
    console.log(` ${this._colors.red('Error')}: ${(this._dependencies.isJsonString(body) === true ? JSON.stringify(body) : body)}`)

    if (!ignoreStack && (body && body.stack)) {
      console.log(` ${this._colors.red('Stacktrace')}: \n${body.stack}`)
    }
  }

  info (body: any, title?: string) {
    console.log(` ${this._colors.cyan(`${title || this._serverName}:`)} ${(this._dependencies.isJsonString(body) === true ? JSON.stringify(body) : body)}`)
  }

  warning (body: any, title?: string) {
    console.log(` ${this._colors.yellow(`${title || this._serverName}:`)} ${(this._dependencies.isJsonString(body) === true ? JSON.stringify(body) : body)}`)
  }

  success (body: any, title?: string) {
    console.log(` ${this._colors.green(`${title || this._serverName}:`)} ${(this._dependencies.isJsonString(body) === true ? JSON.stringify(body) : body)}`)
  }
}

export { ConsoleManager }
