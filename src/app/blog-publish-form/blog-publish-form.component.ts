import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {BlogService} from '../blog.service';
import {MatChipInputEvent} from '@angular/material/chips';
import {MatAutocomplete, MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {Observable} from 'rxjs';
import {map, startWith, tap} from 'rxjs/operators';

@Component({
  selector: 'app-blog-publish-form',
  templateUrl: './blog-publish-form.component.html',
  styleUrls: ['./blog-publish-form.component.css']
})
export class BlogPublishFormComponent implements OnInit {

  folders$;
  allTags$;

  allTags: string[] = [];

  profileForm = new FormGroup({
    title: new FormControl(''),
    author: new FormControl(''),
    createTime: new FormControl({value: new Date(), disabled: true}),
    editTime: new FormControl({value: new Date(), disabled: true}),
    folder: new FormControl(''),
    tags: new FormControl(''),
    abstract: new FormControl('')
  });

  tagCtrl = this.profileForm.get('tags');

  filteredTags: Observable<string[]>;

  @Input() title = '';
  @Input() author = '';
  @Input() abstract = '';
  tags: string[] = [];

  // @ViewChild('fruitInput') fruitInput: ElementRef<HTMLInputElement>;
  // @ViewChild('auto') matAutocomplete: MatAutocomplete;

  constructor(
    private blogService: BlogService
  ) {
    this.folders$ = this.blogService.loadFolders();
    this.allTags$ = this.blogService.loadTags().pipe(
      tap((tags: any) => this.allTags = tags)
    );
    this.filteredTags = this.tagCtrl.valueChanges.pipe(
        startWith(null),
        map((fruit: string | null) => fruit ?
          this._filter(fruit) : this.tags.slice()));
  }

  ngOnInit(): void {
  }

  // add(event: MatChipInputEvent): void {
  //   const input = event.input;
  //   const value = event.value.toLowerCase();
  //
  //   // Add our fruit
  //   if ((value || '').trim()) {
  //     if (this.tags.indexOf(value.trim()) === -1) {
  //       this.tags.push(value.trim());
  //     }
  //   }
  //
  //   // Reset the input value
  //   if (input) {
  //     input.value = '';
  //   }
  //
  //   this.tagCtrl.setValue(null);
  // }
  //
  // remove(tag: string): void {
  //   const value = tag.toLowerCase();
  //   const index = this.tags.indexOf(value);
  //
  //   if (index >= 0) {
  //     this.tags.splice(index, 1);
  //   }
  // }
  //
  // selected(event: MatAutocompleteSelectedEvent): void {
  //   const value = event.option.viewValue.toLowerCase();
  //   if (this.tags.indexOf(value) === -1) {
  //     this.tags.push(value);
  //   }
  //   this.fruitInput.nativeElement.value = '';
  //   this.tagCtrl.setValue(null);
  // }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allTags.filter(fruit =>
      fruit.toLowerCase().indexOf(filterValue) === 0);
  }

  onSubmit() {
    console.log(this.profileForm.value);
  }
}
