import {Directive, Input} from '@angular/core'

@Directive({
  selector: '[appVar]',
  exportAs: 'appVar'
})
export class VarDirective {
  // eslint-disable-next-line
  @Input() var: any
}
