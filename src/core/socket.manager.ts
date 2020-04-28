class SocketManager {
  private _dependencies: any;
  private _console: any;
  private _socket: any;
  private _eventBus: any;

  constructor(dependencies: any) {
    this._dependencies = dependencies
    this._console = dependencies.console
    this._socket = dependencies.socket
    this._eventBus = dependencies.eventBus
  }

  loadSocketEvents () {
    this._socket.on('connection', (client: any) => {
      client.on('reversebytes.beat.api', (data: any) => {
        this._eventBus.emit(
          'admin-event',
          {
            context: data.context || {},
            command: data.command || '',
            values: data.values || {}
          }
        )
      })
      client.on('reversebytes.beat.chatbot', (data: any) => {
        this._eventBus.emit(
          'chatbot-event',
          {
            context: data.context || {},
            command: data.command || '',
            values: data.values || {}
          }
        )
      })
      client.on('reversebytes.beat.client', (data: any) => {
        this._eventBus.emit(
          'client-event',
          {
            context: data.context || {},
            command: data.command || '',
            values: data.values || {}
          }
        )
      })

      client.on('disconnect', () => {
        this._console.success(`Node disconnected ${client.id}`)
      })

      this._console.success(`Node connected ${client.id}`)
    })

    this._console.success('Socket manager loaded')
  }
}

export { SocketManager }
