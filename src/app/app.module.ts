import {MatPaginatorModule} from "@angular/material/paginator";
import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {CookieService} from "ngx-cookie-service";

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
import {
  HttpClient,
  HttpClientModule,
  HttpClientXsrfModule
} from '@angular/common/http';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatCardModule} from '@angular/material/card';
import {MatChipsModule} from '@angular/material/chips';
import {NavbarComponent} from './navbar/navbar.component';
import {ParallaxDirective} from './directives/parallax.directive';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {GotoTopBtnComponent} from './goto-top-btn/goto-top-btn.component';
import {ScrollOutDirective} from './directives/scroll-out.directive';
import {MaterialElevationDirective} from './directives/material-elevation.directive';
import {SafeHtmlPipe} from "./pipes/safe-html.pipe";
import {TagComponent} from './tag/tag.component';
import {BlogCardComponent} from './blog-card/blog-card.component';
import {MatTooltipModule} from '@angular/material/tooltip';
import {NgScrollbarModule} from 'ngx-scrollbar';
import {NgScrollbarReachedModule} from 'ngx-scrollbar/reached-event';
import {WindowHeightTrackingDirective} from './directives/window-height-tracking.directive';
import {BlogDetailComponent} from './blog-detail/blog-detail.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MarkdownModule, MarkedOptions} from 'ngx-markdown';
import {markedOptionsFactory} from './markdown-render-custom';
import {BlogPublishComponent} from './blog-publish/blog-publish.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AutosizeModule} from 'ngx-autosize';
import {BlogPublishFormComponent} from './blog-publish-form/blog-publish-form.component';
import {MatDialogModule} from '@angular/material/dialog';
import {MatNativeDateModule, MatOptionModule} from '@angular/material/core';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {FormFieldTagsComponent} from './form-field-tags/form-field-tags.component';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {TableOfContentComponent} from './table-of-content/table-of-content.component';
import {LoginComponent} from './login/login.component';
import { StickyDirective } from './directives/sticky.directive';
import {MatMenuModule} from '@angular/material/menu';
import {MatRadioModule} from '@angular/material/radio';


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
    WindowHeightTrackingDirective,
    BlogDetailComponent,
    BlogPublishComponent,
    BlogPublishFormComponent,
    FormFieldTagsComponent,
    TableOfContentComponent,
    LoginComponent,
    StickyDirective,
    SafeHtmlPipe,
  ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        RouterModule.forRoot([
            {path: '', component: BlogListComponent},
            {path: 'list', component: BlogListComponent},
            {path: 'blog/:blogId', component: BlogDetailComponent},
            {path: 'publish', component: BlogPublishComponent},
            {path: 'login', component: LoginComponent},
        ]),
        HttpClientModule,
        HttpClientXsrfModule.withOptions({
            cookieName: 'csrftoken',
            headerName: 'X-CSRFToken',
        }),
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
        MatMenuModule,
        NgScrollbarModule,
        NgScrollbarReachedModule,
        FlexLayoutModule,
        MarkdownModule.forRoot({
            loader: HttpClient,
            markedOptions: {
                provide: MarkedOptions,
                useFactory: markedOptionsFactory
            }
        }),
        FormsModule,
        AutosizeModule,
        MatAutocompleteModule,
        MatDialogModule,
        MatOptionModule,
        MatSelectModule,
        MatInputModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatRadioModule,
        ReactiveFormsModule,
        MatSnackBarModule,
        MatPaginatorModule
    ],
  providers: [CookieService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
