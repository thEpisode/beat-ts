class ModelManager {
  private _dependencies: any;
  private _console: any;
  private _models: any;

  constructor(dependencies: any) {
    this._dependencies = dependencies
    this._console = dependencies.console

    this.loadModels()
  }

  loadModels () {
    this._models = require(`${this._dependencies.root}/models/index`)

    this._console.success('Models manager loaded')
  }

  get models () {
    return this._models
  }
}

export { ModelManager }
