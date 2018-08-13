import * as socketIO from 'socket.io-client';
import Socket = SocketIOClient.Socket;
import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {Chat} from '../utils/chat.routes';

@Injectable({
    providedIn: 'root'
})
export class SocketClient {

    private socket: Socket;
    private connected = new Subject<void>();
    private handlers = new Map<string, Observable<any>>();

    connect(url: string, token?: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.socket = socketIO(url);
            this.socket.on(Chat.CONNECT, () => {
                this.socket.emit(Chat.AUTHENTICATE, token, err => {
                    if (err) {
                        reject(err);
                    }
                    this.connected.next();
                    resolve();
                });
            });
        });
    }

    disconnect() {
        this.socket.disconnect();
    }

    onConnect(): Observable<void> {
        return this.connected;
    }

    on<T>(route: string): Observable<T> {
        const handler = this.handlers.get(route);
        if (!handler) {
            this.handlers.set(route, new Observable<T>(observer => {
                this.socket.on(route, (payload: T) => observer.next(payload));
            }));
            return this.on(route);
        }
        return handler;
    }

    sendAnd<T>(route: string, payload: any): Observable<T> {
        return new Observable<T>(observer => {
            this.socket.emit(route, payload, (error: any, response: T) => {
                if (error) {
                    observer.error(error);
                }
                observer.next(response);
                observer.complete();
            });
        });
    }

    send(route: string, payload: any) {
        this.socket.emit(route, payload);
    }
}
