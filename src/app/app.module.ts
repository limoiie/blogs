import {LayoutModule} from '@angular/cdk/layout'
import {
  HTTP_INTERCEPTORS,
  HttpClient,
  HttpClientModule
} from '@angular/common/http'
import {NgModule} from '@angular/core'
import {FlexLayoutModule} from '@angular/flex-layout'
import {FormsModule, ReactiveFormsModule} from '@angular/forms'
import {MatAutocompleteModule} from '@angular/material/autocomplete'
import {MatButtonModule} from '@angular/material/button'
import {MatButtonToggleModule} from '@angular/material/button-toggle'
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
import {
  MAT_SNACK_BAR_DEFAULT_OPTIONS,
  MatSnackBarModule
} from '@angular/material/snack-bar'
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
import {BlogCardComponent} from './components/blog-card/blog-card.component'
import {
  BlogDetailComponent
} from './components/blog-detail/blog-detail.component'
import {BlogListComponent} from './components/blog-list/blog-list.component'
import {
  BlogPublishFormComponent
} from './components/blog-publish-form/blog-publish-form.component'
import {
  BlogPublishComponent
} from './components/blog-publish/blog-publish.component'
import {
  FormFieldTagsComponent
} from './components/form-field-tags/form-field-tags.component'
import {
  GotoTopBtnComponent
} from './components/goto-top-btn/goto-top-btn.component'
import {LoginComponent} from './components/login/login.component'
import {NavbarComponent} from './components/navbar/navbar.component'
import {
  TableOfContentLinkComponent
} from './components/table-of-content-link/table-of-content-link.component'
import {
  TableOfContentComponent
} from './components/table-of-content/table-of-content.component'
import {TagComponent} from './components/tag/tag.component'
import {
  MaterialElevationDirective
} from './directives/material-elevation.directive'
import {ParallaxDirective} from './directives/parallax.directive'
import {ScrollOutDirective} from './directives/scroll-out.directive'
import {StickyDirective} from './directives/sticky.directive'
import {VarDirective} from './directives/var.directive'
import {
  WindowHeightTrackingDirective
} from './directives/window-height-tracking.directive'
import {JwtInterceptor} from './interceptors/jwt.interceptor'
import {markedOptionsFactory} from './markdown-render-custom'
import {SafeHtmlPipe} from './pipes/safe-html.pipe'

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
    TableOfContentLinkComponent,
    VarDirective
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot([
      {path: '', component: BlogListComponent},
      {path: 'blogs', component: BlogListComponent},
      {path: 'blogs/tags/:tags', component: BlogListComponent},
      {path: 'blogs/:blogId', component: BlogDetailComponent},
      {path: 'publish', component: BlogPublishComponent}
    ], {
      scrollPositionRestoration: 'enabled',
      anchorScrolling: 'enabled'
    }),
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
    ReactiveFormsModule,
    MatButtonToggleModule
  ],
  providers: [CookieService,
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
    {provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: {duration: 2500}}
  ],
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
