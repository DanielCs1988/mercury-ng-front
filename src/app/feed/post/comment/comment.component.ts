import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {CommentService} from '../../../services/comment.service';
import {Comment, Like, User} from '../../../models';
import {NgForm} from '@angular/forms';
import {UserService} from '../../../services/user.service';
import {LikeService} from '../../../services/like.service';
import {Subscription} from 'rxjs';
import {faEdit, faThumbsDown, faThumbsUp, faTrashAlt} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit, OnDestroy {

    @Input('comment') comment: Comment;
    @Input('postId') postId: string;
    @ViewChild('commentForm') commentForm: NgForm;

    private userSubscription: Subscription;
    private like: Like;

    user: User;
    liked: boolean;
    editing = false;

    editIcon = faEdit;
    deleteIcon = faTrashAlt;
    likeIcon = faThumbsUp;
    dislikeIcon = faThumbsDown;

    constructor(
        private commentService: CommentService,
        private likeService: LikeService,
        private userService: UserService
    ) { }

    ngOnInit() {
        this.userSubscription = this.userService.currentUser.subscribe(user => {
            this.user = user;
            if (user) {
                this.like = this.comment.likes.find(like => like.user.id === user.id);
                this.liked = this.like !== undefined;
            }
        });
    }

    onDeleteComment() {
        this.commentService.deleteComment(this.comment.id, this.postId);
    }

    onUpdateComment() {
        const text = this.commentForm.value.text;
        this.commentService.updateComment(this.comment.id, text, this.comment.createdAt);
    }

    onStartEditing() {
        this.editing = true;
        setTimeout(() => {
            this.commentForm.setValue({
                text: this.comment.text
            });
        }, 0);
    }

    onLike() {
        if (this.like) {
            return;
        }
        this.liked = true;
        this.likeService.likeComment(this.comment.id).subscribe(like => {
            this.like = like.data.likeComment;
        });
    }

    onDislike() {
        if (!this.like) {
            return;
        }
        this.liked = false;
        this.likeService.dislikeComment(this.like.id, this.comment.id);
        this.like = null;
    }

    ngOnDestroy(): void {
        this.userSubscription.unsubscribe();
    }
}
