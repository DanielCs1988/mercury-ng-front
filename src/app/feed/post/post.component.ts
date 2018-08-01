import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Like, Post, User} from '../../models';
import {NgForm} from '@angular/forms';
import {PostService} from '../../services/post.service';
import {CommentService} from '../../services/comment.service';
import {LikeService} from '../../services/like.service';
import {UserService} from '../../services/user.service';
import {Subscription} from 'rxjs';
import {faEdit, faThumbsDown, faThumbsUp, faTrashAlt} from '@fortawesome/free-solid-svg-icons';
import {Apollo, QueryRef} from 'apollo-angular';
import {COMMENT_SUBSCRIPTION, FETCH_COMMENTS} from '../../queries/comment';
import {CommentSubscription} from '../../services/subscriptions/comment.subscription';
import {CommentLikeSubscription} from '../../services/subscriptions/comment-like.subscription';
import {COMMENT_LIKE_SUBSCRIPTION} from '../../queries/likes';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit, OnDestroy {

    @Input('post') post: Post;
    @ViewChild('postForm') postForm: NgForm;
    @ViewChild('commentForm') commentForm: NgForm;

    private commentsQuery: QueryRef<any>;
    private commentsSub: Subscription;
    private userSubscription: Subscription;
    private like: Like;

    comments: Comment[] = [];
    user: User;
    liked: boolean;
    editing = false;
    zoomed = false;

    editIcon = faEdit;
    deleteIcon = faTrashAlt;
    likeIcon = faThumbsUp;
    dislikeIcon = faThumbsDown;

    constructor(
        private apollo: Apollo,
        private postService: PostService,
        private commentService: CommentService,
        private likeService: LikeService,
        private userService: UserService,
        private commentChanges: CommentSubscription,
        private commentLikeChanges: CommentLikeSubscription
    ) { }

    ngOnInit() {
        this.userSubscription = this.userService.currentUser.subscribe(user => {
            this.user = user;
            if (user) {
                this.like = this.post.likes.find(like => like.user.id === user.id);
                this.liked = this.like !== undefined;
            }
        });
        if (this.post.id !== '') {
            this.fetchComments();
        }
    }

    private fetchComments() {
        this.commentsQuery = this.apollo.watchQuery<any>({
            query: FETCH_COMMENTS,
            variables: {
                postId: this.post.id
            }
        });
        this.commentsSub = this.commentsQuery.valueChanges.subscribe(({data, loading}) => {
            this.comments = data.comments;
        });
        this.commentsQuery.subscribeToMore({
            document: COMMENT_SUBSCRIPTION,
            variables: { postId: this.post.id },
            updateQuery: this.commentChanges.commentReducer
        });
        this.commentsQuery.subscribeToMore({
            document: COMMENT_LIKE_SUBSCRIPTION,
            variables: { postId: this.post.id },
            updateQuery: this.commentLikeChanges.commentLikeReducer
        })
    }

    onUpdate() {
        const text = this.postForm.value.post;
        const pictureUrl = this.postForm.value.picture;
        this.editing = false;
        this.postService.updatePost(this.post.id, this.post.createdAt, text, pictureUrl);
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
        if (confirm('Are you sure you want to delete your post?')) {
            this.postService.deletePost(this.post.id);
        }
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
        if (this.commentsSub) {
            this.commentsSub.unsubscribe();
        }
    }

    toggleImageView() {
        this.zoomed = !this.zoomed;
    }
}
