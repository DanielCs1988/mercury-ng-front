import {Component, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {PostService} from '../../services/post.service';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {

  @ViewChild('postForm') postForm: NgForm;

  constructor(private postService: PostService) { }

  ngOnInit() {
  }

  onPost() {
    const text = this.postForm.value.post;
    const pictureUrl = this.postForm.value.picture;
    this.postForm.reset();
    this.postService.createPost(text, pictureUrl);
  }
}
