class ControllerManager {
  private _dependencies: any;
  private _console: any;
  private _controllers: any;

  constructor(dependencies: any) {
    this._dependencies = dependencies
    this._console = dependencies.console

    this.loadControllers()
  }

  loadControllers () {
    const { lstatSync, readdirSync } = require('fs')
    const { join } = require('path')
    this._controllers = {}

    try {
      // Read all directories in controllers folder
      const isDirectory = (source: any) => lstatSync(source).isDirectory()
      const getDirectories = (source: any) =>
        readdirSync(source).map((name: string) => join(source, name)).filter(isDirectory)

      const directories = getDirectories(`${this._dependencies.root}//controllers/`)

      // Map all controllers
      for (const path of directories) {
        try {
          if (path) {
            const name = path.split('\\')[path.split('\\').length - 1]
            const pathName = `${path}\\${name}.controller`
            // self and dynamic propagation
            this._dependencies.controllers = this._controllers
            this._controllers[name] = require(pathName)(this._dependencies)
          }
        } catch (error) {
          this._console.error(`Error on path ${path}`)
          this._console.error(error)
        }
      }
    } catch (error) {
      this._console.error(error)
    }
  }

  get controllers () {
    return this._controllers
  }
}

export { ControllerManager }
