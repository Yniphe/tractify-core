import { EventEmitter } from "node:events";
import { ClientRequest } from "node:http";

export class RequestPipe extends EventEmitter {
  readonly writable = true;
  readonly stack: Buffer[] = [];

  constructor(readonly channel: ClientRequest) {
    super();
  }

  write(buffer: Uint8Array, cb?: (err?: Error | null) => void): boolean;
  write(
    str: Uint8Array | string,
    encoding?: BufferEncoding,
    cb?: (err?: Error | null) => void
  ): boolean;
  write(message?: Uint8Array | string): boolean {
    if (message?.length) {
      /**
       * добавляем данные в стек
       */
      this.stack.push(Buffer.from(message));
    }

    /**
     * пересылаем данные в запрос
     */
    this.channel.write(message);

    return true;
  }

  end(cb?: any): this;
  end(data: Uint8Array, cb?: any): this;
  end(str: Uint8Array, encoding?: BufferEncoding, cb?: any): this;
  end(message?: Uint8Array): this {
    this.channel.end(message);

    if (message?.length) {
      this.stack.push(Buffer.from(message));
    }

    return this;
  }
}
