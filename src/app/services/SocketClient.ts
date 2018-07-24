import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {take} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class SocketClient {

    private static SEPARATOR = '&';
    private static TIME_BEFORE_RECONNECT_ATTEMPT = 10000;

    private socket: WebSocket;
    private cache: Transaction[] = [];
    private handlers = new Map<string, Subject<any>>();
    private onOpenHandler: Function;
    private onCloseHandler: Function;
    private isOpen = false;
    private isClosed = false;

    constructor() {
        setInterval(() => {
            if (this.isOpen && this.cache.length > 0) {
                const transaction = this.cache.shift();
                this.send(transaction.route, transaction.payload);
            }
        }, 100);
    }

    connect(domain: string, port: number, token?: string) {
        if (this.isOpen) return;
        const url = token ? `ws://${domain}:${port}/${token}` : `ws://${domain}:${port}`;
        this.socket = new WebSocket(url);
        this.socket.addEventListener('open', (ev) => this.onOpenConnection(ev));
        this.socket.addEventListener('close', (ev) => this.onClosedConnection(ev, domain, port, token));
        this.socket.addEventListener('message', event => this.processMessage(event.data));
    }

    disconnect() {
        if (this.socket) {
            this.isClosed = true;
            this.cache = [];
            this.socket.close();
        }
    }

    isConnected(): boolean {
        return this.isOpen;
    }

    onOpen(callback: Function) {
         this.onOpenHandler = callback;
    }

    onClose(callback: Function) {
        this.onCloseHandler = callback;
    }

    on<T>(route: string): Subject<T> {
        const handler = this.handlers.get(route);
        if (!handler) {
            this.handlers.set(route, new Subject<T>());
            return this.on(route);
        }
        return handler;
    }

    fetchOnce<T>(route: string): Observable<T> {
        return this.on<T>(route).pipe(take(1));
    }

    send(route: string, payload: any) {
        if (!this.isOpen) {
          this.cacheMessage(route, payload);
          return;
        }
        const content = typeof payload === 'string' ? payload : JSON.stringify(payload);
        const message = route + SocketClient.SEPARATOR + content;
        this.socket.send(message);
    }

    sendAnd<T>(route: string, payload: any): Observable<T> {
        const response = this.fetchOnce<T>(route);
        this.send(route, payload);
        return response;
    }

    private cacheMessage(route: string, payload: any) {
        const transaction: Transaction = { route, payload };
        this.cache.push(transaction);
    }

    private processMessage(raw: string) {
        const fullMsg = raw.split(SocketClient.SEPARATOR, 2);
        this.handleMessages(fullMsg[0], fullMsg[1]);
    }

    private handleMessages(route: string, payload: string) {
        const handler = this.handlers.get(route);
        if (handler) {
            const object = JSON.parse(payload);
            handler.next(object);
        } else {
            console.info(`Received message with no corresponding handler:\nRoute: ${route}\nPayload: ${payload}`);
        }
    }

    private onOpenConnection(event: any) {
        this.isOpen = true;
        if (this.onOpenHandler) this.onOpenHandler.call(null, event);
    }

    private onClosedConnection(event: any, domain: string, port: number, token?: string) {
        this.isOpen = false;
        if (this.onCloseHandler) this.onCloseHandler.call(null, event);
        if (this.isClosed) { return; }
        setTimeout(() => {
            this.connect(domain, port, token);
        }, SocketClient.TIME_BEFORE_RECONNECT_ATTEMPT);
    }
}

interface Transaction {
    route: string,
    payload: any
}
