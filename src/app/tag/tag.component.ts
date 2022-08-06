import {Component, Input} from '@angular/core'

@Component({
  selector: 'app-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.sass']
})
export class TagComponent {
  @Input() tagName!: string
}
