import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.sass']
})
export class TagComponent implements OnInit {
  @Input() tagName;

  constructor() { }

  ngOnInit(): void {
  }

}
