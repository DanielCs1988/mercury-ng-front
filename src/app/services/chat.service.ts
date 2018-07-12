import {Injectable, OnDestroy} from '@angular/core';
import {Message, User} from '../models';
import {Subject, Subscription} from 'rxjs';
import {SocketClient} from './SocketClient';
import {UserService} from './user.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService implements OnDestroy {

    private userSub: Subscription;
    private msgSub: Subscription;

    private cache = new Map<string, Message[]>();
    private messageEmitter = new Subject<Message>();
    private currentUser: User;
    private currentTarget: string;

    constructor(private socket: SocketClient, private userService: UserService) { }

    init() {
        this.userSub = this.userService.currentUser.subscribe(user => {
            this.currentUser = user;
            if (user) {
                this.initMessageSubscription();
            }
        });
    }

    async getChatHistory(targetId: string): Promise<Message[]> {
        this.currentTarget = targetId;

        if (!this.cache.get(targetId)) {
            this.cache.set(targetId, []);
            const history = await this.socket.sendAnd('private/history', targetId);
            this.cache.set(targetId, [...history, ...this.cache.get(targetId)]);
            return history;
        }
        return this.cache.get(targetId).slice();
    }

    getMessageSubscription(): Subject<Message> {
        return this.messageEmitter;
    }

    async sendMessage(content: string) {
        if (!this.currentTarget) {
            throw new Error('Cannot send messages when no target is selected!');
        }
        let message: Message = { content, to: this.currentTarget };
        message = await this.socket.sendAnd('private/send', message);
        this.cache.get(this.currentTarget).push(message);
        return message;
    }

    closeChat() {
        this.currentTarget = null;
    }

    private initMessageSubscription() {
        if (this.msgSub) {
            return this.cleanupPreviousSession();
        }
        this.msgSub = this.socket.on('private/receive').subscribe(message => {
            if (this.cache.has(message.from)) {
                this.cache.get(message.from).push(message);
            }
            if (message.from === this.currentTarget) {
                this.messageEmitter.next(message);
            } else {
                this.userService.markUnreadMessages(message.from);
            }
        });
    }

    private cleanupPreviousSession() {
        console.log('Cleanup called after logging in with a different user.');
        this.cache.clear();
    }

    ngOnDestroy(): void {
        this.userSub.unsubscribe();
        this.msgSub.unsubscribe();
    }
}
