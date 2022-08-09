import {Component, Input, OnInit} from '@angular/core'
import {TreeNode} from '../../misc/tree-node'
import {Link} from './link'

@Component({
  selector: 'app-table-of-content-link',
  templateUrl: './table-of-content-link.component.html',
  styleUrls: ['./table-of-content-link.sass']
})
export class TableOfContentLinkComponent implements OnInit {

  @Input() node!: TreeNode<Link>

  constructor() {
    //  nothing to do
  }

  ngOnInit(): void {
    //  nothing to do
  }

}
