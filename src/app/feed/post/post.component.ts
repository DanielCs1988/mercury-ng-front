import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Like, Post} from '../../models';
import {NgForm} from '@angular/forms';
import {PostService} from '../../services/post.service';
import {CommentService} from '../../services/comment.service';
import {LikeService} from '../../services/like.service';
import {UserService} from '../../services/user.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit, OnDestroy {

    @Input('post') post: Post;
    @ViewChild('postForm') postForm: NgForm;
    @ViewChild('commentForm') commentForm: NgForm;

    private userSubscription: Subscription;
    private like: Like;

    liked: boolean;
    editing = false;

    constructor(
        private postService: PostService,
        private commentService: CommentService,
        private likeService: LikeService,
        private userService: UserService
    ) { }

    ngOnInit() {
        this.userSubscription = this.userService.currentUser.subscribe(user => {
            if (user) {
                this.like = this.post.likes.find(like => like.user.id === user.id);
                this.liked = this.like !== undefined;
            }
        });
    }

    onUpdate() {
        const text = this.postForm.value.post;
        const pictureUrl = this.postForm.value.picture;
        this.editing = false;
        this.postService.updatePost(this.post.id, text, pictureUrl);
    }

    onStartEditing() {
        this.editing = true;
        setTimeout(() => {
            this.postForm.setValue({
                post: this.post.text,
                picture: this.post.pictureUrl
            });
        }, 0);
    }

    onDelete() {
        this.postService.deletePost(this.post.id);
    }

    onNewComment() {
        const text = this.commentForm.value.comment;
        this.commentService.createComment(this.post.id, text);
        this.commentForm.reset();
    }

    onLike() {
        if (this.like) {
            return;
        }
        this.liked = true;
        this.likeService.likePost(this.post.id).subscribe(like => {
            this.like = like.data.likePost;
        });
    }

    onDislike() {
        if (!this.like) {
            return;
        }
        this.liked = false;
        this.likeService.dislikePost(this.like.id, this.post.id);
        this.like = null;
    }

    ngOnDestroy(): void {
        this.userSubscription.unsubscribe();
    }
}
