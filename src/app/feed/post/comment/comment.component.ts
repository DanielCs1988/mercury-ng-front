import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {CommentService} from '../../../services/comment.service';
import {Comment} from '../../../models';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styles: []
})
export class CommentComponent implements OnInit {

    @Input('comment') comment: Comment;
    @Input('postId') postId: string;
    @ViewChild('commentForm') commentForm: NgForm;
    editing = false;

    constructor(private commentService: CommentService) { }

    ngOnInit() {
    }

    onDeleteComment() {
        this.commentService.deleteComment(this.comment.id, this.postId);
    }

    onUpdateComment() {
        const text = this.commentForm.value.text;
        this.commentService.updateComment(this.comment.id, text);
    }

    onStartEditing() {
        this.editing = true;
        setTimeout(() => {
            this.commentForm.setValue({
                text: this.comment.text
            });
        }, 0);
    }
}
