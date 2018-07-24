import {Injectable} from '@angular/core';
import {Actions, Effect} from '@ngrx/effects';
import {Store} from '@ngrx/store';
import {AppState} from '../app.reducers';
import * as actions from './chat.actions';
import {SocketClient} from '../../services/SocketClient';

@Injectable()
export class ChatEffects {

    @Effect()
    sendMessage = this.actions$.ofType(actions.SEND_MESSAGE).pipe(
        // Stuff
    );

    constructor(
        private actions$: Actions,
        private store: Store<AppState>,
        private socket: SocketClient
    ) {}
}
