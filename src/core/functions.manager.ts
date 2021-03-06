import * as Bucket from "./../functions/bucket"

class FunctionsManager {
  private _dependencies: any;
  private _console: any;
  private _moment: any;
  private _bucket: any;
  private _functions: any;

  constructor(dependencies: any) {
    this._dependencies = dependencies
    this._console = dependencies.console
    this._moment = dependencies.moment
    this._bucket = Bucket
    this._functions = {
      cached: {},
      timed: {}
    }

    this.createCached()
    this.createTimed()

    this._console.success('Functions manager loaded')
  }

  createCached () {
    // build each api routes
    this._bucket.functions.cached.map((component: any) => {
      try {
        this._console.success(`Initializing ${component.name} function`)

        /* Setup config */
        const _functionName = component.route.split('/')[component.route.split('/').length - 1]
        const name = _functionName.split('.')[0]
        const pathname = `${this._dependencies.root}/${component.route}`

        /* Setup namespace */
        this._functions.cached[name] = require(pathname)(this._dependencies)
      } catch (error) {
        this._console.error(`Component failed: ${JSON.stringify(component)}`, true)
        this._console.error(error)
      }
    })
  }

  createTimed () {
    // build each api routes
    this._bucket.functions.timed.map((component: any) => {
      try {
        const _function = require(`${this._dependencies.root}/${component.route}`)(this._dependencies)
        const seconds = this._moment(`${component.startAt}`, 'hh:mm:ss').diff(this._moment(), 'milliseconds') > 0
          /* Add the next ticket if has time remaining */
          ? this._moment(`${component.startAt}`, 'hh:mm:ss')
            .diff(this._moment(), 'milliseconds')
          /* Add necesary time to next ticket */
          : this._moment(`${component.startAt}`, 'HH:mm:ss')
            .add(this._moment.duration(+`${component.intervalTime}`, `${component.intervalMeasure}`), `${component.intervalMeasure}`)
            .diff(this._moment(), 'milliseconds')

        this._console.success(`Initializing ${component.name} function`)

        /* Including in dependencies */
        this._functions.timed[component.name] = _function

        if (seconds > 0) {
          setTimeout(() => {
            /* Execute at first tick */
            _function[component.name]()

            /* Setup next ticks */
            setInterval(
              _function[component.name],
              this._moment.duration(+`${component.intervalTime}`, `${component.intervalMeasure}`).as('milliseconds')
            )
          }, seconds)
        }
      } catch (error) {
        this._console.error(`Component failed: ${JSON.stringify(component)}`, true)
        this._console.error(error)
      }
    })
  }
}

export { FunctionsManager }
