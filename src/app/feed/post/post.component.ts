import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {Post} from '../../models';
import {NgForm} from '@angular/forms';
import {PostService} from '../../services/post.service';
import {CommentService} from '../../services/comment.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {

  @Input('post') post: Post;
  @ViewChild('postForm') postForm: NgForm;
  @ViewChild('commentForm') commentForm: NgForm;
  editing = false;

  constructor(private postService: PostService, private commentService: CommentService) { }

  ngOnInit() {
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
}
