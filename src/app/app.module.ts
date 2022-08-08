import {LayoutModule} from '@angular/cdk/layout'
import {
  HttpClient,
  HttpClientModule,
  HttpClientXsrfModule
} from '@angular/common/http'
import {NgModule} from '@angular/core'
import {FlexLayoutModule} from '@angular/flex-layout'
import {FormsModule, ReactiveFormsModule} from '@angular/forms'
import {MatAutocompleteModule} from '@angular/material/autocomplete'
import {MatButtonModule} from '@angular/material/button'
import {MatCardModule} from '@angular/material/card'
import {MatChipsModule} from '@angular/material/chips'
import {MatNativeDateModule, MatOptionModule} from '@angular/material/core'
import {MatDatepickerModule} from '@angular/material/datepicker'
import {MatDialogModule} from '@angular/material/dialog'
import {MatIconModule, MatIconRegistry} from '@angular/material/icon'
import {MatInputModule} from '@angular/material/input'
import {MatListModule} from '@angular/material/list'
import {MatMenuModule} from '@angular/material/menu'
import {MatPaginatorModule} from '@angular/material/paginator'
import {MatProgressBarModule} from '@angular/material/progress-bar'
import {MatRadioModule} from '@angular/material/radio'
import {MatSelectModule} from '@angular/material/select'
import {MatSidenavModule} from '@angular/material/sidenav'
import {MatSlideToggleModule} from '@angular/material/slide-toggle'
import {MatSnackBarModule} from '@angular/material/snack-bar'
import {MatToolbarModule} from '@angular/material/toolbar'
import {MatTooltipModule} from '@angular/material/tooltip'
import {BrowserModule} from '@angular/platform-browser'
import {BrowserAnimationsModule} from '@angular/platform-browser/animations'
import {RouterModule} from '@angular/router'
import {
  NgxHateoasClientConfigurationService,
  NgxHateoasClientModule
} from '@lagoshny/ngx-hateoas-client'
import {AutosizeModule} from 'ngx-autosize'
import {CookieService} from 'ngx-cookie-service'
import {MarkdownModule, MarkedOptions} from 'ngx-markdown'
import {NgScrollbarModule} from 'ngx-scrollbar'
import {NgScrollbarReachedModule} from 'ngx-scrollbar/reached-event'

import {AppComponent} from './app.component'
import {Blog, WithAbstractBlog} from './beans/blog'
import {BlogCardComponent} from './blog-card/blog-card.component'
import {BlogDetailComponent} from './blog-detail/blog-detail.component'
import {BlogListComponent} from './blog-list/blog-list.component'
import {
  BlogPublishFormComponent
} from './blog-publish-form/blog-publish-form.component'
import {BlogPublishComponent} from './blog-publish/blog-publish.component'
import {
  MaterialElevationDirective
} from './directives/material-elevation.directive'
import {ParallaxDirective} from './directives/parallax.directive'
import {ScrollOutDirective} from './directives/scroll-out.directive'
import {StickyDirective} from './directives/sticky.directive'
import {
  WindowHeightTrackingDirective
} from './directives/window-height-tracking.directive'
import {
  FormFieldTagsComponent
} from './form-field-tags/form-field-tags.component'
import {GotoTopBtnComponent} from './goto-top-btn/goto-top-btn.component'
import {LoginComponent} from './login/login.component'
import {markedOptionsFactory} from './markdown-render-custom'
import {NavbarComponent} from './navbar/navbar.component'
import {SafeHtmlPipe} from './pipes/safe-html.pipe'
import {
  TableOfContentLinkComponent
} from './table-of-content-link/table-of-content-link.component'
import {
  TableOfContentComponent
} from './table-of-content/table-of-content.component'
import {TagComponent} from './tag/tag.component'

@NgModule({
  declarations: [
    AppComponent,
    BlogCardComponent,
    BlogDetailComponent,
    BlogListComponent,
    BlogPublishComponent,
    BlogPublishFormComponent,
    FormFieldTagsComponent,
    GotoTopBtnComponent,
    LoginComponent,
    MaterialElevationDirective,
    NavbarComponent,
    ParallaxDirective,
    SafeHtmlPipe,
    ScrollOutDirective,
    StickyDirective,
    TableOfContentComponent,
    TagComponent,
    WindowHeightTrackingDirective,
    TableOfContentLinkComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot([
      {path: '', component: BlogListComponent},
      {path: 'list', component: BlogListComponent},
      {path: 'blogs/:blogId', component: BlogDetailComponent},
      {path: 'publish', component: BlogPublishComponent}
    ], {
      scrollPositionRestoration: 'enabled',
      anchorScrolling: 'enabled'
    }),
    HttpClientModule,
    HttpClientXsrfModule.withOptions({
      cookieName: 'csrftoken',
      headerName: 'X-CSRFToken'
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
    MatSnackBarModule,
    MatPaginatorModule,
    NgxHateoasClientModule.forRoot(),
    ReactiveFormsModule
  ],
  providers: [CookieService],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(
    matIconRegistry: MatIconRegistry,
    hateoasClientConfigurationService: NgxHateoasClientConfigurationService
  ) {
    matIconRegistry.registerFontClassAlias('mso', 'material-symbols-outlined')
    hateoasClientConfigurationService.configure({
      http: {
        rootUrl: 'http://localhost:8080/api'
      },
      useTypes: {
        resources: [Blog, WithAbstractBlog]
      }
    })
  }
}
