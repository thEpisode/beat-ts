class FrontendManager {
  private _dependencies: any;
  private _console: any;
  private _app: any;
  private _express: any;
  private _path: any;
  private _maintenance: any;
  private _router: any;

  constructor(dependencies: any) {
    this._dependencies = dependencies
    this._console = dependencies.console
    this._app = dependencies.express
    this._express = dependencies.expressModule
    this._path = dependencies.path
    this._maintenance = require(`${dependencies.root}/src/routes/frontend/maintenance/maintenance.route`)(dependencies)
    this._router = require(`${dependencies.root}/src/routes/router`)

    this.loadFrontendRoutes()
  }

  loadFrontendRoutes () {
    /// Setup engine for Express
    const viewsRoute = `${this._dependencies.root.split('\\build')[0]}/src/views`
    this._app.set('views', viewsRoute)
    this._app.set('view engine', 'jsx')
    this._app.engine('jsx', require('express-react-views').createEngine())

    // build each frontend routes
    this._router.router.frontend.map(async (component: any) => {
      try {
        const componentView = await require(`${this._dependencies.root}/src${component.route}`)(this._dependencies)

        this._app.get(component.httpRoute, componentView[component.handler])
      } catch (error) {
        this._console.error(`Component failed: ${JSON.stringify(component)}`, true)
      }
    })

    // publish all files under public folder
    this._app.use(this._express.static(this._path.join(this._dependencies.root, '/static/public')))
    this._app.use('/private', this._express.static(this._path.join(this._dependencies.root, '/static/private')))

    this.importCustomStaticRoutes()

    // Something else, 404 error
    /* this._app.get('*', this._maintenance.index)

    this._app.use((err: any, req: any, res: any, next: any) => {
      res.redirect(`/maintenance?error=${err.code}&message=${err.message}`)
      next()
    }) */

    this._console.success('FrontEnd manager loaded')
  }

  importCustomStaticRoutes () {
    const dependencies = this._dependencies.config.CUSTOM_STATIC_ROUTES

    if (!dependencies || !dependencies.length) {
      return
    }

    dependencies.map((customRoute: any) => {
      this._app.use(customRoute.route, this._express.static(this._path.join(this._dependencies.root, customRoute.path)))
    })
  }
}

export { FrontendManager }
