import {FocusMonitor} from '@angular/cdk/a11y'
import {coerceBooleanProperty} from '@angular/cdk/coercion'
import {COMMA, ENTER} from '@angular/cdk/keycodes'
import {AutofillMonitor} from '@angular/cdk/text-field'
import {
  AfterViewInit,
  Component,
  ElementRef,
  HostBinding,
  Input,
  OnDestroy,
  Optional,
  Self,
  ViewChild
} from '@angular/core'
import {
  ControlValueAccessor,
  FormBuilder,
  FormControl,
  FormGroup,
  NgControl
} from '@angular/forms'
import {
  MatAutocomplete,
  MatAutocompleteSelectedEvent
} from '@angular/material/autocomplete'
import {MatChipInputEvent} from '@angular/material/chips'
import {MatFormFieldControl} from '@angular/material/form-field'
import {combineLatest, Observable, Subject} from 'rxjs'
import {map, startWith, takeUntil} from 'rxjs/operators'
import {BlogService} from '../services/blog.service'

@Component({
  selector: 'app-form-field-tags',
  templateUrl: './form-field-tags.component.html',
  styleUrls: ['./form-field-tags.component.css'],
  providers: [
    {
      provide: MatFormFieldControl,
      useExisting: FormFieldTagsComponent
    }
  ]
})
export class FormFieldTagsComponent
implements
    AfterViewInit,
    OnDestroy,
    MatFormFieldControl<string[]>,
    ControlValueAccessor
{
  static nextId = 0
  parts: FormGroup
  @ViewChild('fruitInput') tagInput!: ElementRef<HTMLInputElement>
  @ViewChild('auto') matAutocomplete!: MatAutocomplete
  fakeCtrl = new FormControl('')
  filteredTags: Observable<string[]>
  separatorKeysCodes: number[] = [ENTER, COMMA]
  @HostBinding() id = `tags-input-${FormFieldTagsComponent.nextId++}`
  stateChanges = new Subject<void>()
  destroy = new Subject<void>()
  focused = false
  controlType = 'tags-input'
  autofilled = false
  isTouched = false
  allTags$
  allTags: string[] = []
  @HostBinding('attr.aria-describedby') describedBy = ''

  constructor(
    formBuilder: FormBuilder,
    @Optional() @Self() public ngControl: NgControl,
    private fm: FocusMonitor,
    private elRef: ElementRef<HTMLElement>,
    private autofillMonitor: AutofillMonitor,
    private blogService: BlogService
  ) {
    this.parts = formBuilder.group({
      tags: []
    })
    if (this.ngControl != null) {
      // Setting the value accessor directly (instead of using
      // the providers) to avoid running into a circular import.
      this.ngControl.valueAccessor = this
    }

    fm.monitor(elRef.nativeElement, true).subscribe((origin) => {
      this.focused = !!origin
      this.stateChanges.next()
    })

    this.allTags$ = this.blogService
      .loadTags()
      .subscribe((tags: any) => (this.allTags = tags.slice()))

    this.filteredTags = this.fakeCtrl.valueChanges.pipe(
      startWith(null),
      map((x) => this._filterCandidateTags(x))
    )
  }

  @Input()
  get value() {
    return this.parts.value.tags || []
  }

  set value(val) {
    val = val || []
    this.parts.setValue({tags: val})
    this.stateChanges.next()
  }

  get errorState() {
    return this.ngControl.errors !== null && this.isTouched
  }

  // tslint:disable-next-line:variable-name
  private _placeholder = ''

  @Input()
  get placeholder() {
    return this._placeholder
  }

  set placeholder(plh) {
    this._placeholder = plh
    this.stateChanges.next()
  }

  // tslint:disable-next-line:variable-name
  private _required = false

  @Input()
  get required() {
    return this._required
  }

  set required(req) {
    this._required = coerceBooleanProperty(req)
    this.stateChanges.next()
  }

  // tslint:disable-next-line:variable-name
  private _disabled = false

  @Input()
  get disabled(): boolean {
    return this._disabled
  }

  set disabled(value: boolean) {
    this._disabled = coerceBooleanProperty(value)
    this._disabled ? this.parts.disable() : this.parts.enable()
    this.stateChanges.next()
  }

  get empty() {
    const tags = this.parts.value.tags
    return !tags || tags.length === 0
  }

  @HostBinding('class.floating')
  get shouldLabelFloat() {
    return this.focused || !this.empty
  }

  ngAfterViewInit(): void {
    this.fm.monitor(this.elRef.nativeElement, true).subscribe((focusOrigin) => {
      if (this.focused !== !!focusOrigin) {
        this.focused = !!focusOrigin
        this.stateChanges.next()
      }
    })

    combineLatest([this.observeAutofill(this.tagInput)])
      .pipe(
        map((autofill) => autofill.some((autofilled) => autofilled)),
        takeUntil(this.destroy)
      )
      .subscribe((autofilled) => {
        this.autofilled = autofilled
        this.stateChanges.next()
      })
  }

  ngOnDestroy() {
    this.destroy.next()
    this.destroy.complete()
    this.stateChanges.complete()
    this.fm.stopMonitoring(this.elRef.nativeElement)
    this.autofillMonitor.stopMonitoring(this.tagInput)
  }

  setDescribedByIds(ids: string[]) {
    this.describedBy = ids.join(' ')
  }

  onContainerClick(event: MouseEvent) {
    if ((event.target as Element).tagName.toLowerCase() !== 'input') {
      this.elRef.nativeElement.querySelector('input')?.focus()
    }
  }

  onTouched(): void {
    //  nothing to do
  }

  registerOnChange(onChange: (value: string[] | null) => void): void {
    this.parts.valueChanges.pipe(takeUntil(this.destroy)).subscribe(onChange)
  }

  registerOnTouched(onTouched: () => void): void {
    this.onTouched = onTouched
  }

  onBlur() {
    this.isTouched = true
  }

  setDisabledState(shouldDisable: boolean): void {
    if (shouldDisable) {
      this.parts.disable()
    } else {
      this.parts.enable()
    }

    this.disabled = shouldDisable
  }

  writeValue(value: string[] | null): void {
    value = value || []

    this.parts.setValue({tags: value}, {emitEvent: false})
  }

  // noinspection DuplicatedCode
  add(event: MatChipInputEvent): void {
    const input = event.input
    const value = event.value.toLowerCase()

    const tags = this.value

    // Add our fruit
    if ((value || '').trim()) {
      if (tags.indexOf(value.trim()) === -1) {
        tags.push(value.trim())
        this.value = tags
      }
    }

    // Reset the input value
    if (input) {
      input.value = ''
    }
  }

  remove(tag: string): void {
    const value = tag.toLowerCase()
    const index = this.value.indexOf(value)

    const tags = this.value

    if (index >= 0) {
      tags.splice(index, 1)
      this.value = tags
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const value = event.option.viewValue.toLowerCase()

    const tags = this.value

    if (tags.indexOf(value) === -1) {
      tags.push(value)
      this.value = tags
    }

    this.tagInput.nativeElement.value = ''
  }

  private observeAutofill(ref: ElementRef): Observable<boolean> {
    return this.autofillMonitor.monitor(ref).pipe(
      map((event) => event.isAutofilled),
      startWith(false)
    )
  }

  private _filterCandidateTags(value: string | null): string[] {
    if (this.allTags.length == 0) {
      return []
    }

    const tags = this.value
    const input = (value || '').toLowerCase()
    return this.allTags
      .map((tag) => tag.toLowerCase())
      .filter((tag) => tag.startsWith(input))
      .filter((tag) => tags.indexOf(tag) === -1)
  }
}
