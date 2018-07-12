import {Injectable, OnDestroy} from '@angular/core';
import {Message, User} from '../models';
import {Subject, Subscription} from 'rxjs';
import {SocketClient} from './SocketClient';
import {UserService} from './user.service';
import {headersToString} from 'selenium-webdriver/http';

@Injectable({
  providedIn: 'root'
})
export class ChatService implements OnDestroy {

    private SOCKET_URL = 'localhost';
    private SOCKET_PORT = 8080;

    private userSub: Subscription;
    private msgSub: Subscription;
    private cache = new Map<string, Message[]>();
    private messageBroker: Subject<Message>;
    private messageEmitter = new Subject<Message>();
    private currentUser: User;
    private currentTarget: string;

    constructor(private socket: SocketClient, private userService: UserService) {
        this.userSub = userService.currentUser.subscribe(user => {
            this.currentUser = user;
            if (user) {
                const token = localStorage.getItem('access_token');
                socket.connect(this.SOCKET_URL, this.SOCKET_PORT, token);
                socket.onOpen(() => this.initMessageSubscription());
            }
        })
    }

    async getChatHistory(targetId: string): Promise<Message[]> {
        this.currentTarget = targetId;
        let history = this.cache.get(targetId);
        console.log('Getting history:', history);

        if (!history) {
            this.cache.set(targetId, []);
            history = await this.socket.sendAnd('private/history', targetId);
            console.log('After awaiting socket aswer...', history);
            this.cache.set(targetId, [...history, ...this.cache.get(targetId)]);
        }
        return history;
    }

    subscribeToMessages(): Subject<Message> {
        return this.messageEmitter;
    }

    async sendMessage(content: string) {
        if (!this.currentTarget) {
            throw new Error('Cannot send messages when no target is selected!');
        }
        let message: Message = { content, to: this.currentTarget };
        console.log('Message being sent', message);
        message = await this.socket.sendAnd('private/send', message);
        this.cache.get(this.currentTarget).push(message);
        return message;
    }

    closeChat() {
        this.currentTarget = null;
    }

    private initMessageSubscription() {
        if (this.messageBroker !== undefined) return;
        this.messageBroker = this.socket.on('private/receive');
        this.messageBroker.subscribe(message => {
            console.log('Received single message in service:', message);
            if (this.cache.has(message.from)) {
                this.cache.get(message.from).push(message);
            }
            if (message.from === this.currentTarget) {
                console.log('Message emitted');
                this.messageEmitter.next(message);
            } else {
                this.userService.markUnreadMessages(message.from);
            }
        });
    }

    ngOnDestroy(): void {
        this.userSub.unsubscribe();
        this.msgSub.unsubscribe();
    }
}
