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
        this.userSub = this.userService.currentUser.subscribe(user => this.currentUser = user);
        this.routeSub = this.route.params.subscribe((params: Params) => {
            const id = params['id'];
            this.currentTarget = this.userService.getUserById(id);
            console.log(this.currentTarget);
            this.initMessages();
        });
    }

    private async initMessages() {
        this.messages = await this.chatService.getChatHistory(this.currentTarget.googleId);
        // TODO: Check if the subscription is actually destroyed here when switching between different chat panes
        this.messageSub = this.chatService.subscribeToMessages(this.currentTarget.googleId)
            .subscribe(message => this.messages.push(message));
    }

    async onSendMessage() {
        if (!this.chatForm.valid) return;
        const content = this.chatForm.value.content.trim();
        const optimisticResponse: Message = {
            content,
            id: -1,
            from: this.currentUser.googleId,
            to: this.currentTarget.googleId,
            createdAt: new Date().getTime()
        };
        this.messages.push(optimisticResponse);
        const swapIndex = this.messages.length;
        this.messages[swapIndex] = await this.chatService.sendMessage(content);
    }

    ngOnDestroy(): void {
        this.routeSub.unsubscribe();
        this.userSub.unsubscribe();
        this.messageSub.unsubscribe();
        this.chatService.closeChat();
    }
}
