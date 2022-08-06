import {Directive, ElementRef, Input} from '@angular/core'
import {MainScrollService} from '../services/main-scroll.service'

/**
 * This directive sticks target elem by sync the scroll offset
 */
@Directive({
  selector: '[appSticky]'
})
export class StickyDirective {
  initAbsTop = undefined

  /**
   * The minimum relative top where the target elem should be sticky
   */
  @Input() whereSticky!: number

  /**
   * The initial top of the target elem
   */
  @Input() initTop = 200
  constructor(
    private eleRef: ElementRef,
    private scrollService: MainScrollService
  ) {
    // this.initialTop = eleRef.nativeElement.getBoundingClientRect().top
    this.scrollService.pureScrolled$.subscribe(([, scrollOffset]) => {
      const absTop =
        this.initAbsTop ||
        this.eleRef.nativeElement.getBoundingClientRect().top + scrollOffset
      this.initAbsTop = absTop

      // console.log(`NE TOP: ${this.eleRef.nativeElement.getBoundingClientRect().top}`)
      //
      //                                 -------------     -----
      //                                 |           |  scrollOffset
      // ----+-----------+---------------+-----------+-------------- top-bar
      //     |           |     ^         |           |       ^
      //     |           |     .         |           |  initAbsTop - scrollOffset
      //     |           |  initAbsTop   |           |       v
      //     |           |     .         |       === |     -----
      //     |           |     v         |           |  scrollOffset
      //     |        ===|   -----       |           |     -----
      //     |           |

      let adjustTop = this.initTop
      if (absTop - scrollOffset <= this.whereSticky) {
        adjustTop += scrollOffset - (absTop - this.whereSticky)
      }
      this.eleRef.nativeElement.style.top = adjustTop + 'px'
    })
  }
}
