import {Component, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {BlogService} from '../blog.service';

@Component({
  selector: 'app-blog-publish-form',
  templateUrl: './blog-publish-form.component.html',
  styleUrls: ['./blog-publish-form.component.css']
})
export class BlogPublishFormComponent implements OnInit {

  folders$;

  profileForm = new FormGroup({
    title: new FormControl(''),
    author: new FormControl(''),
    createTime: new FormControl({value: new Date(), disabled: true}),
    editTime: new FormControl({value: new Date(), disabled: true}),
    folder: new FormControl(''),
    tags: new FormControl(''),
    abstract: new FormControl('')
  });

  @Input() title = '';
  @Input() author = '';
  @Input() abstract = '';
  tags: string[] = [];

  constructor(
    private blogService: BlogService
  ) {
    this.folders$ = this.blogService.loadFolders();
  }

  ngOnInit(): void {
  }

  onSubmit() {
    console.log(this.profileForm.value);
  }
}
