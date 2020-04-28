class FirebaseManager {
  private _dependencies: any;
  private _console: any;
  private _firebaseAdminCredentials: any;
  private _firebaseCredentials: any;
  private _firebaseURL: any;

  constructor(dependencies: any) {
    this._dependencies = dependencies
    this._console = dependencies.console

    this._firebaseAdminCredentials = ''
    this._firebaseCredentials = ''
    this._firebaseURL = ''
  }

  setSettings () {
    this.setFirebaseAdminCredentials(this._dependencies.config.FIREBASE_ADMIN)
    this.setFirebaseCredentials(this._dependencies.config.FIREBASE)
    this.setFirebaseURL(this._dependencies.config.FIREBASE.databaseURL)
  }

  getFirebaseCredentials () {
    return this._firebaseCredentials
  }

  setFirebaseCredentials (firebaseCredentials: any) {
    this._firebaseCredentials = firebaseCredentials
  }

  getFirebaseAdminCredentials () {
    return this._firebaseAdminCredentials
  }

  setFirebaseAdminCredentials (firebaseAdminCredentials: any) {
    this._firebaseAdminCredentials = firebaseAdminCredentials
  }

  getFirebaseURL () {
    return this._firebaseURL
  }

  setFirebaseURL (firebaseURL: string) {
    this._firebaseURL = firebaseURL
  }

  castArraySnapshot (snapshot: any) {
    if (snapshot) {
      const arr: any[] = []
      const obj: any = {}

      snapshot.docs.forEach((childSnapshot: any) => {
        const item = childSnapshot.data()
        arr.push(item)
      })

      obj.raw = snapshot
      obj.data = arr

      return obj
    } else {
      return null
    }
  }

  castObjectSnapshot (snapshot: any) {
    if (!snapshot || snapshot.isEmpty) {
      return null
    }

    const item = snapshot.data()

    if (!item) {
      return null
    }

    const obj: any = {}

    obj.rawId = snapshot.id
    obj.formatted = item
    obj.raw = snapshot

    return obj
  }

  get cast () {
    return {
      array: this.castArraySnapshot.bind(this),
      object: this.castObjectSnapshot.bind(this)
    }
  }
}

export { FirebaseManager }
