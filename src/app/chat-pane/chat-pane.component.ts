import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ChatService} from '../services/chat.service';
import {UserService} from '../services/user.service';
import {ActivatedRoute, Params} from '@angular/router';
import {Subscription} from 'rxjs';
import {Message, User} from '../models';
import {NgForm} from '@angular/forms';

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
        private chatService: ChatService,
        private userService: UserService,
        private route: ActivatedRoute
    ) { }

    ngOnInit() {
        this.$chatWindow = document.querySelector('.chat-window');
        this.userSub = this.userService.currentUser.subscribe(user => this.currentUser = user);
        this.routeSub = this.route.params.subscribe((params: Params) => {
            const id = params['id'];
            this.currentTarget = this.userService.getUserById(id);
            this.initMessages();
        });
    }

    private async initMessages() {
        if (!this.messageSub) {
            this.messageSub = this.chatService.getMessageSubscription()
                .subscribe(message => {
                    this.messages.push(message);
                });
        }
        this.messages = await this.chatService.getChatHistory(this.currentTarget.googleId);
        this.scrollToBottom();
    }

    private scrollToBottom() {
        setTimeout(() => this.$chatWindow.scrollTop = this.$chatWindow.scrollHeight, 0);
    }

    async onSendMessage() {
        if (!this.chatForm.valid) return;
        const content = this.chatForm.value.content.trim();
        this.chatForm.reset();
        this.scrollToBottom();
        const optimisticResponse: Message = {
            content,
            id: -1,
            from: this.currentUser.googleId,
            to: this.currentTarget.googleId,
            createdAt: new Date().getTime()
        };
        this.messages.push(optimisticResponse);
        const swapIndex = this.messages.length - 1;
        this.messages[swapIndex] = await this.chatService.sendMessage(content);
    }

    owner(message: Message): User {
        return message.from === this.currentUser.googleId ? this.currentUser : this.currentTarget;
    }

    ngOnDestroy(): void {
        this.routeSub.unsubscribe();
        this.userSub.unsubscribe();
        this.messageSub.unsubscribe();
        this.chatService.closeChat();
    }
}
