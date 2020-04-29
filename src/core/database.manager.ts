import { FirebaseManager } from "./firebase.manager"
import { PostgresqlManager } from "./postgresql.manager"

class DatabaseManager {
  private _dependencies: any;
  private _console: any;
  private _firebaseManager: any;
  private _postgresqlManager: any;
  private _firebase: any;
  private _pg: any;
  private _db: any;

  constructor(dependencies: any) {


    this._dependencies = dependencies
    this._console = dependencies.console
    this._firebaseManager = new FirebaseManager(dependencies)
    this._postgresqlManager = new PostgresqlManager(dependencies)
    this._firebase = dependencies.firebase
    this._pg = dependencies.pg
    this._db = {}

    this.loadDatabase()
  }

  async loadDatabase () {
    if (!this._dependencies.config.USE_DATABASE) {
      this._console.info('Database is not configured')
      return
    }

    switch (this._dependencies.config.DATABASE_NAME) {
      case 'firebase':
        this._firebaseManager.setSettings()
        this._dependencies.settings.dependencies.core.add(this._firebaseManager, 'firebaseManager')
        await this.firebaseConfig()
        break
      case 'postgresql':
        this._postgresqlManager.setSettings()
        this._dependencies.settings.dependencies.core.add(this._postgresqlManager, 'postgresqlManager')
        await this.postgresqlConfig()
        break
      default:
        break
    }

    this._dependencies.db = this._db || {}
    this._console.success('Database manager loaded')
  }

  async postgresqlConfig () {
    const pool = new this._pg.Pool(this._postgresqlManager.getCredentials())
    this._db = pool
  }

  async firebaseConfig () {
    this._firebase.initializeApp({
      credential: this._firebase.credential.cert(this._firebaseManager.getFirebaseAdminCredentials()),
      databaseURL: this._firebaseManager.getFirebaseURL()
    })

    const settings = { timestampsInSnapshots: true }
    this._db = this._firebase.firestore()
    this._db.settings(settings)
  }
}

export { DatabaseManager }
