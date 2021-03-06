import {Injectable, OnDestroy} from '@angular/core';
import {Actions, Effect} from '@ngrx/effects';
import {Store} from '@ngrx/store';
import {AppState} from '../app.reducers';
import {SocketClient} from '../../services/SocketClient';
import {map, switchMap, take, tap} from 'rxjs/operators';
import {Message, User} from '../../models';
import {Subscription} from 'rxjs';
import {ChatState} from './chat.reducers';
import {UserService} from '../../services/user.service';
import {ActionTypes, MessageSent, SendMessage, FetchHistory, ReceiveMessage} from './chat.actions';
import {Chat} from '../../utils/chat.routes';

@Injectable()
export class ChatEffects implements OnDestroy {

    @Effect()
    sendMessage = this.actions$.ofType(ActionTypes.SEND_MESSAGE).pipe(
        tap((action: SendMessage) => {
            const optimisticResponse = {
                ...action.payload,
                _id: '',
                from: this.currentUser.googleId,
                createdAt: new Date().getTime()
            };
            this.store.dispatch(new MessageSent(optimisticResponse));
        }),
        switchMap((action: SendMessage) => {
            return this.socket.sendAnd<Message>(Chat.SEND_PRIVATE_MESSAGE, action.payload);
        }),
        map(message => ({
            type: ActionTypes.MESSAGE_SENT,
            payload: message
        }))
    );

    @Effect()
    fetchHistory = this.actions$.ofType(ActionTypes.FETCH_HISTORY).pipe(
        switchMap((action: FetchHistory) => {
            return this.socket.sendAnd<Message[]>(Chat.GET_PRIVATE_HISTORY, action.payload);
        }),
        map(messages => ({
            type: ActionTypes.HISTORY_FETCHED,
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
        this.socket.onConnect().pipe(take(1)).subscribe(() => this.initMessageListener());
    }

    private initMessageListener() {
        this.chatSub = this.socket.on<Message>(Chat.RECEIVE_PRIVATE_MESSAGE).subscribe(message => {
            if (this.openChannels.has(message.from) && message.from !== this.currentUser.googleId) {
                this.store.dispatch(new ReceiveMessage(message));
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
