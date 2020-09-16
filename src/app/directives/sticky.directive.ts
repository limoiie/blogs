import {Directive, ElementRef, Input} from '@angular/core';
import {MainScrollService} from '../services/main-scroll.service';

/**
 * This directive sticks target elem by sync the scroll offset
 */
@Directive({
  selector: '[appSticky]'
})
export class StickyDirective {
  initialTop = -1;

  /**
   * The minimum relative top where the target elem should be sticky
   */
  @Input() whereSticky = 100;
  constructor(
    private eleRef: ElementRef,
    private scrollService: MainScrollService
  ) {
    // this.initialTop = eleRef.nativeElement.getBoundingClientRect().top;
    this.scrollService.pureScrolled$.subscribe(
      ([, scrollOffset]) => {
        if (this.initialTop === -1) {
          this.initialTop = this.eleRef.nativeElement.getBoundingClientRect().top + scrollOffset;
        }
        //
        //                                 -------------     -----
        //                                 |           |  scrollTop
        // ----+-----------+---------------+-----------+-------------- top-bar
        //     |           |     ^         |           |       ^
        //     |           |     .         |           |  initTop - scrollTop
        //     |           |  initTop      |           |       v
        //     |           |     .         |       === |     -----
        //     |           |     v         |           |  scrollTop
        //     |        ===|   -----       |           |     -----
        //     |           |

        // this.initialTop = eleRef.nativeElement.getBoundingClientRect().top;
        if (this.initialTop - scrollOffset <= this.whereSticky) {
          this.eleRef.nativeElement.style.top = this.whereSticky + scrollOffset + 'px';
        }
      }
    );
  }

}
