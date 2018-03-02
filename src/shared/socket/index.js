class Socket {
  async attach(server: number | net$Server, cb: Function) {
    if (Number.isInteger(server)) return this.listen(Number(server), cb);
    return this.observe(server);
  }
  async listen(port: number, host?: string, backlog?: number, cb?: Function) {
    this.server = new net.Server();
    this.server.listen(port);
    return this.server;
  }
}
