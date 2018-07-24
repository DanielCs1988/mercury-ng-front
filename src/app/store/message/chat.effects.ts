import {Injectable, OnDestroy} from '@angular/core';
import {Actions, Effect} from '@ngrx/effects';
import {Store} from '@ngrx/store';
import {AppState} from '../app.reducers';
import * as actions from './chat.actions';
import {SocketClient} from '../../services/SocketClient';
import {map, switchMap, tap} from 'rxjs/operators';
import {Message} from '../../models';
import {Subscription} from 'rxjs';
import {ChatState} from './chat.reducers';
import {UserService} from '../../services/user.service';

@Injectable()
export class ChatEffects implements OnDestroy {

    @Effect()
    sendMessage = this.actions$.ofType(actions.SEND_MESSAGE).pipe(
        switchMap((action: actions.SendMessage) => {
            return this.socket.sendAnd<Message>('private/send', action.payload);
        }),
        map(message => ({
            type: actions.MESSAGE_SENT,
            payload: message
        }))
    );

    @Effect()
    changeTarget = this.actions$.ofType(actions.CHANGE_TARGET).pipe(
        tap((action: actions.ChangeTarget) => this.store.dispatch(new actions.TargetChanged(action.payload))),
        switchMap((action: actions.ChangeTarget) => {
            return this.socket.sendAnd<Message[]>('private/history', action.payload);
        }),
        map(messages => ({
            type: actions.HISTORY_FETCHED,
            payload: messages
        }))
    );

    private chatSub: Subscription;
    private storeSub: Subscription;
    private openChannels = new Set<string>();
    private currentTarget: string;

    constructor(
        private actions$: Actions,
        private store: Store<AppState>,
        private socket: SocketClient,
        private userService: UserService
    ) {
        this.initMessageListener();
        this.storeSub = this.store.select('chat').subscribe((chatState: ChatState) => {
            this.openChannels = new Set<string>(chatState.openChannels);
            this.currentTarget = chatState.target;
        });
    }

    private initMessageListener() {
        this.chatSub = this.socket.on<Message>('private/receive').subscribe(message => {
            if (this.openChannels.has(message.from)) {
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
    }
}
