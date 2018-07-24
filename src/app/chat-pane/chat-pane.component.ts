import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {UserService} from '../services/user.service';
import {ActivatedRoute, Params} from '@angular/router';
import {Subscription} from 'rxjs';
import {Message, User} from '../models';
import {NgForm} from '@angular/forms';
import {Store} from '@ngrx/store';
import {AppState} from '../store/app.reducers';
import {ChangeTarget, CloseChat, FetchHistory, SendMessage} from '../store/message/chat.actions';
import {ChatState} from '../store/message/chat.reducers';

@Component({
  selector: 'app-chat-pane',
  templateUrl: './chat-pane.component.html',
  styleUrls: ['./chat-pane.component.css']
})
export class ChatPaneComponent implements OnInit, OnDestroy {

    private routeSub: Subscription;
    private userSub: Subscription;
    private messageSub: Subscription;
    private $chatWindow;

    @ViewChild('chatForm') chatForm: NgForm;

    messages: Message[] = [];
    currentTarget: User;
    currentUser: User;

    constructor(
        private store: Store<AppState>,
        private userService: UserService,
        private route: ActivatedRoute
    ) { }

    ngOnInit() {
        this.$chatWindow = document.querySelector('.chat-window');
        this.userSub = this.userService.currentUser.subscribe(user => this.currentUser = user);
        this.routeSub = this.route.params.subscribe((params: Params) => {
            const id = params['id'];
            this.currentTarget = this.userService.getUserById(id);
            this.userService.markMessagesRead(this.currentTarget.googleId);
            this.initMessages(this.currentTarget.googleId);
        });
    }

    private async initMessages(target: string) {
        if (this.messageSub) {
            this.messageSub.unsubscribe();
        }
        this.store.dispatch(new ChangeTarget(target));
        this.messageSub = this.store.select('chat').subscribe((chatState: ChatState) => {
            this.messages = chatState.history[target];
            if (!this.messages) {
                this.store.dispatch(new FetchHistory(target));
            }
            this.scrollToBottom();
        });
    }

    private scrollToBottom() {
        setTimeout(() => this.$chatWindow.scrollTop = this.$chatWindow.scrollHeight, 0);
    }

    async onSendMessage() {
        if (!this.chatForm.valid) return;
        const content = this.chatForm.value.content.trim();
        const message = { content, to: this.currentTarget.googleId };
        this.chatForm.reset();
        this.store.dispatch(new SendMessage(message));
        // const optimisticResponse: Message = {
        //     content,
        //     id: -1,
        //     from: this.currentUser.googleId,
        //     to: this.currentTarget.googleId,
        //     createdAt: new Date().getTime()
        // };
    }

    owner(message: Message): User {
        return message.from === this.currentUser.googleId ? this.currentUser : this.currentTarget;
    }

    ngOnDestroy(): void {
        this.routeSub.unsubscribe();
        this.userSub.unsubscribe();
        this.messageSub.unsubscribe();
        this.store.dispatch(new CloseChat());
    }
}
