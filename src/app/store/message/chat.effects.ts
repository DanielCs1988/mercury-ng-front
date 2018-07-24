import {Injectable, OnDestroy} from '@angular/core';
import {Actions, Effect} from '@ngrx/effects';
import {Store} from '@ngrx/store';
import {AppState} from '../app.reducers';
import * as actions from './chat.actions';
import {SocketClient} from '../../services/SocketClient';
import {map, switchMap, takeWhile, tap} from 'rxjs/operators';
import {Message, User} from '../../models';
import {Subscription} from 'rxjs';
import {ChatState} from './chat.reducers';
import {UserService} from '../../services/user.service';

@Injectable()
export class ChatEffects implements OnDestroy {

    @Effect()
    sendMessage = this.actions$.ofType(actions.SEND_MESSAGE).pipe(
        tap((action: actions.SendMessage) => {
            const optimisticResponse = {
                ...action.payload,
                id: -1,
                from: this.currentUser.googleId,
                createdAt: new Date().getTime()
            };
            this.store.dispatch(new actions.MessageSent(optimisticResponse));
        }),
        switchMap((action: actions.SendMessage) => {
            return this.socket.sendAnd<Message>('private/send', action.payload);
        }),
        map(message => ({
            type: actions.MESSAGE_SENT,
            payload: message
        }))
    );

    @Effect()
    fetchHistory = this.actions$.ofType(actions.FETCH_HISTORY).pipe(
        switchMap((action: actions.FetchHistory) => {
            return this.socket.sendAnd<Message[]>('private/history', action.payload);
        }),
        map(messages => ({
            type: actions.HISTORY_FETCHED,
            payload: messages
        }))
    );

    private chatSub: Subscription;
    private storeSub: Subscription;
    private userSub: Subscription;

    private openChannels = new Set<string>();
    private currentTarget: string;
    private currentUser: User;

    constructor(
        private actions$: Actions,
        private store: Store<AppState>,
        private socket: SocketClient,
        private userService: UserService
    ) {
        this.userSub = this.userService.currentUser.subscribe(user => this.currentUser = user);
        this.storeSub = this.store.select('chat').subscribe((chatState: ChatState) => {
            this.openChannels = new Set<string>(chatState.openChannels);
            this.currentTarget = chatState.target;
        });
        this.initMessageListener();
    }

    private initMessageListener() {
        this.chatSub = this.socket.on<Message>('private/receive').subscribe(message => {
            if (this.openChannels.has(message.from) && message.from !== this.currentUser.googleId) {
                this.store.dispatch(new actions.ReceiveMessage(message));
            }
            if (message.from !== this.currentTarget) {
                this.userService.markUnreadMessages(message.from);
            }
        });
    }

    ngOnDestroy(): void {
        this.chatSub.unsubscribe();
        this.storeSub.unsubscribe();
        this.userSub.unsubscribe();
    }
}
