import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RouterModule} from '@angular/router';
import {BlogListComponent} from './blog-list/blog-list.component';
import {LayoutModule} from '@angular/cdk/layout';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import {HttpClientModule} from '@angular/common/http';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatCardModule} from '@angular/material/card';
import {MatChipsModule} from '@angular/material/chips';
import {NavbarComponent} from './navbar/navbar.component';
import {ParallaxDirective} from './parallax.directive';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {GotoTopBtnComponent} from './goto-top-btn/goto-top-btn.component';
import {ScrollOutDirective} from './scroll-out.directive';
import {MaterialElevationDirective} from './material-elevation.directive';
import {TagComponent} from './tag/tag.component';
import {BlogCardComponent} from './blog-card/blog-card.component';
import {MatTooltipModule} from '@angular/material/tooltip';
import {NgScrollbarModule} from 'ngx-scrollbar';
import {NgScrollbarReachedModule} from 'ngx-scrollbar/reached-event';
import { FitWindowHeightDirective } from './fit-window-height.directive';


@NgModule({
  declarations: [
    AppComponent,
    BlogListComponent,
    NavbarComponent,
    ParallaxDirective,
    GotoTopBtnComponent,
    ScrollOutDirective,
    MaterialElevationDirective,
    TagComponent,
    BlogCardComponent,
    FitWindowHeightDirective
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot([
      {path: '', component: BlogListComponent}
    ]),
    HttpClientModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatProgressBarModule,
    MatCardModule,
    MatChipsModule,
    MatSlideToggleModule,
    MatTooltipModule,
    NgScrollbarModule,
    NgScrollbarReachedModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
