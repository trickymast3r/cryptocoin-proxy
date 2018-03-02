//@flow
import BaseEvent from '@mrjs/core/event';

class Connection extends BaseEvent {
  id: Number;
  constructor(socket: net$Socket) {
    super();
  }
  $connection(socket: net$Socket) {

  }
  $data(client: net$Socket, data: string) {}
  $error(client: net$Socket, err: Error) {
    this.close(client);
  }
  $close(client: net$Socket) {
    this.close(client);
  }
}

export default Connection;
