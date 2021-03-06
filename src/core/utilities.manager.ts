class UtilitiesManager {
  private _dependencies: any;
  private _console: any;
  private _crypto: any;

  constructor(dependencies: any) {
    this._dependencies = dependencies
    this._console = dependencies.console
    this._crypto = dependencies.crypto
  }

  /// Find an object dynamically by dot style
  /// E.g.
  /// var objExample = {employee: { firstname: "camilo", job:{name:"developer"}}}
  /// searchDotStyle(objExample, 'employee.job.name')
  searchDotStyle (obj: any, query: any) {
    return query.split('.').reduce((key: any, val: any) => key[val], obj)
  }

  idGenerator (length: number, prefix: string) {
    // Generate 256 random bytes and converted to hex to prevent failures on unscaped chars
    const buffer = this._crypto.randomBytes(256)
    const randomToken = buffer.toString('hex')
    // Generating of token
    return `${prefix || 'seed-'}${randomToken.slice(0, length)}`
  }

  propertyIsValid (property: any) {
    let isValid = false

    if (property && property.success === true) {
      isValid = true
    }

    return isValid
  }

  throwError (message: string) {
    if (message) {
      return { success: false, message: message, result: null }
    }

    return { success: false, message: 'Something was wrong while you make this action', result: null }
  }

  throwSuccess (data: any, message: string) {
    const succesResponse = {
      success: true,
      message: message || 'Operation completed successfully',
      result: data || {}
    }

    return succesResponse
  }

  badRequestView (req: any, res: any, payload: any) {
    res.render('maintenance/maintenance.view.jsx', payload)
  }

  cleanObjectData (rawObj: any) {
    if (rawObj && rawObj.formatted) {
      return rawObj.formatted
    } else if (rawObj && rawObj.data) {
      return rawObj.data
    } else {
      return null
    }
  }

  // Search an object in a simple array
  findObject (query: any, _array: any) {
    return _array.find(function (element: any) {
      return element === query
    })
  }

  // Search an item by an object key
  findObjectByKey (query: string, key: string, _array: any) {
    return _array.find(function (element: any) {
      return element[key] === query
    })
  }

  findDeepObjectByKey (query: any, key: any, _array: any) {
    return _array.find((element: any) => {
      const deepObject = this.searchDotStyle(element, key)
      return deepObject === query
    })
  }

  // Return index otherwise -1 is returned
  findIndexByKey (query:string, key:string, _array: any) {
    return _array.findIndex(function (element: any) {
      return element[key] === query
    })
  }

  // Return index otherwise -1 is returned
  findIndex (query: any, _array: any) {
    return _array.findIndex(function (element: any) {
      return element === query
    })
  }

  findAndRemove (query: any, _array: any) {
    const index = _array.findIndex(function (element: any) {
      return element === query
    })

    if (index > -1) {
      _array.splice(index, 1)
    }
    return index
  }

  findAndRemoveByKey (query:string, key:string, _array: any) {
    const index = _array.findIndex(function (element: any) {
      return element[key] === query
    })

    if (index > -1) {
      _array.splice(index, 1)
    }
    return index
  }

  serializerOjectToQueryString (obj: any, prefix?: any): any {
    if (obj && typeof obj === 'object') {
      const serializedArr = []
      let key: any = {}

      for (key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          const k = prefix ? prefix + '[' + key + ']' : key
          const value = obj[key] || null
          serializedArr.push((value !== null && typeof value === 'object')
            ? this.serializerOjectToQueryString(value, k)
            : encodeURIComponent(k) + '=' + encodeURIComponent(value))
        }
      }
      return serializedArr.join('&')
    }
  }

  objectToQueryString (obj: any) {
    if (obj && typeof obj === 'object') {
      const result = this.serializerOjectToQueryString(obj)
      return `?${result}`
    } else {
      return ''
    }
  }

  isEmpty (obj: any) {
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        return false
      }
    }
    return true
  }

  getParameters (data: any) {
    if (!data) { return {} }

    if (!this.isEmpty(data.query)) {
      return data.query
    } else if (!this.isEmpty(data.body)) {
      return data.body
    } else if (!this.isEmpty(data.params)) {
      return data.params
    } else {
      return {}
    }
  }

  get objectIsEmpty () {
    return this.isEmpty.bind(this)
  }

  get serializer () {
    return {
      object: {
        toQueryString: this.objectToQueryString.bind(this)
      }
    }
  }

  get request () {
    return {
      getParameters: this.getParameters.bind(this)
    }
  }

  get response () {
    return {
      success: this.throwSuccess.bind(this),
      error: this.throwError.bind(this),
      badRequestView: this.badRequestView.bind(this),
      isValid: this.propertyIsValid.bind(this),
      clean: this.cleanObjectData.bind(this)
    }
  }

  get searchers () {
    return {
      object: {
        searchDotStyle: this.searchDotStyle.bind(this),
        findAndRemove: this.findAndRemoveByKey.bind(this),
        findIndex: this.findIndexByKey.bind(this),
        findObject: this.findObjectByKey.bind(this),
        findDeepObject: this.findDeepObjectByKey.bind(this)
      },
      array: {
        findAndRemove: this.findAndRemove.bind(this),
        findIndex: this.findIndex.bind(this),
        findObject: this.findObject.bind(this)
      }
    }
  }
}

export { UtilitiesManager }
