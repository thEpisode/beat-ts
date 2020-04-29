import { SettingsManager } from "./settings.manager"
import { ConsoleManager } from "./console.manager"
import { ModelManager } from "./model.manager"
import { DalManager } from "./dal.manager"
import { GeolocatorManager } from "./geolocator.manager"
import { AuthManager } from "./auth.manager"
import { DatabaseManager } from "./database.manager"
import { StorageManager } from "./storage.manager"
import { ControllerManager } from "./controller.manager"
import { ApiManager } from "./api.manager"
import { FunctionsManager } from "./functions.manager"
import { SocketManager } from "./socket.manager"

class ServerManager {
  private _settings: SettingsManager;
  private _console: ConsoleManager;

  constructor(public args: any) {
    this._settings = new SettingsManager(args)
    this._console = new ConsoleManager(this.settings.dependencies.core.get())
  }

  async loadServer () {
    try {
      this.registerSettings()

      this.registerConsole()

      this.registerAuth()

      this.registerDal()

      await this.registerDatabase()

      await this.registerStorage()

      this.socketSetup()

      await this.registerGeolocator()

      this.registerModels()

      this.registerControllers()

      this.registerSocket()

      this.registerFunctions()

      this.registerApi()

      this._console.success('Server manager loaded')

      this.registerServer()

      return this._settings.dependencies.get()
    } catch (error) {
      console.log(error)
      process.exit()
    }
  }

  registerModels () {
    const _modelsManager = new ModelManager(this._settings.dependencies.get())

    this._settings.dependencies.core.add(_modelsManager.models, 'models')
  }

  async registerDal () {
    const _dalManager = new DalManager(this._settings.dependencies.get())

    this._settings.dependencies.core.add(_dalManager, 'dal')
  }

  async registerGeolocator () {
    const _geolocatorManager = new GeolocatorManager(this._settings.dependencies.get())

    await _geolocatorManager.loadDatabases()

    this._settings.dependencies.core.add(_geolocatorManager, 'geolocator')
  }

  registerSettings () {
    this._settings.dependencies.core.add(this._settings, 'settings')
  }

  registerConsole () {
    this._settings.dependencies.core.add(this._console, 'console')
  }

  registerAuth () {
    const _auth = new AuthManager(this._settings.dependencies.get())

    this._settings.dependencies.core.add(_auth, 'auth')
  }

  registerDatabase () {
    const _databaseManager = new DatabaseManager(this._settings.dependencies.get())

    return _databaseManager
  }

  registerStorage () {
    const _storageManager = new StorageManager(this._settings.dependencies.get())

    return _storageManager.loadStorage()
  }

  registerControllers () {
    const _controllersManager = new ControllerManager(this._settings.dependencies.get())

    this._settings.dependencies.core.add(_controllersManager.controllers, 'controllers')
  }

  registerApi () {
    const _apiManager = new ApiManager(this._settings.dependencies.get())

    this._settings.dependencies.core.add(_apiManager, 'apiManager')
  }

  registerFunctions () {
    const _functionsManager = new FunctionsManager(this._settings.dependencies.get())

    this._settings.dependencies.core.add(_functionsManager, 'functions')
  }

  socketSetup () {
    // Listening and setup socket
    const socket = this._settings.dependencies.get().socketModule(this._settings.dependencies.get().httpServer, {})
    socket.origins((origin: any, callback: any) => {
      callback(null, true)
    })
    this._settings.dependencies.core.add(socket, 'socket')


    const _socketManager = new SocketManager(this._settings.dependencies.get())

    return _socketManager
  }

  registerSocket () {
    // Initialize socket when controllers are initialized
    const core = this._settings.dependencies.core.get()
    const socketController = core.controllers.socket
    socketController.initialize()
  }

  registerServer () {
    // Listening on port
    const port = this.normalizePort(process.env.PORT || this._settings.dependencies.get().config.SERVER_PORT)
    if (port) {
      this._settings.dependencies.get().httpServer.listen(port)
    } else {
      this._console.error('Failed to find a port for this app, please setup on PORT environment variable or default config file')
      process.exit(0)
    }
  }

  normalizePort (val: string) {
    const port = parseInt(val, 10)

    if (isNaN(port)) return val
    if (port >= 0) return port

    return false
  }

  get settings () {
    return this._settings
  }
}

export { ServerManager }