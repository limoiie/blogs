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
import {BlogService} from '../../services/blog.service'

@Component({
  selector: 'app-form-field-tags',
  templateUrl: './form-field-tags.component.html',
  styleUrls: ['./form-field-tags.component.css'],
  providers: [
    {  // todo: comment this?
      provide: MatFormFieldControl,
      useExisting: FormFieldTagsComponent
    }
  ]
})
export class FormFieldTagsComponent implements AfterViewInit, OnDestroy,
  MatFormFieldControl<string[]>, ControlValueAccessor {
  ctrl: FormControl<string[]> = this.formBuilder.nonNullable.control<string[]>([])
  inputCtrl: FormControl<string> = this.formBuilder.nonNullable.control<string>('')
  @HostBinding() id = `tags-input-${Date.now()}`
  @HostBinding('attr.aria-describedby') describedBy = ''
  @ViewChild('tagInput') tagInput!: ElementRef<HTMLInputElement>
  @ViewChild('auto') matAutocomplete!: MatAutocomplete
  filteredTags$: Observable<string[]>
  separatorKeysCodes: number[] = [ENTER, COMMA]
  stateChanges = new Subject<void>()
  destroy = new Subject<void>()
  focused = false
  controlType = 'tags-input'
  autofilled = false
  isTouched = false
  allTags: string[] = []

  constructor(
    private formBuilder: FormBuilder,
    @Optional() @Self() public ngControl: NgControl,
    private fm: FocusMonitor,
    private elRef: ElementRef<HTMLElement>,
    private autofillMonitor: AutofillMonitor,
    private blogService: BlogService
  ) {
    if (this.ngControl != null) {
      // Setting the value accessor directly (instead of using
      // the providers) to avoid running into a circular import.
      this.ngControl.valueAccessor = this
    }

    fm.monitor(elRef.nativeElement, true).subscribe((origin) => {
      this.focused = !!origin
      this.stateChanges.next()
    })

    //todo: load from cloud
    this.blogService.loadTags()
      .subscribe((tags: string[]) => (this.allTags = tags.slice()))

    this.filteredTags$ = this.inputCtrl.valueChanges.pipe(
      startWith(null),
      map((x) => this._filterCandidateTags(x))
    )
  }

  @Input()
  get value(): string[] {
    return this.ctrl.value || []
  }
  set value(val: string[] | null) {
    this.ctrl.setValue(val || [])
    this.stateChanges.next()
  }

  get errorState() {
    return this.ngControl.errors !== null && this.isTouched
  }

  @Input()
  get placeholder() {
    return this._placeholder
  }
  set placeholder(plh) {
    this._placeholder = plh
    this.stateChanges.next()
  }
  private _placeholder = 'Tag...'

  @Input()
  get required() {
    return this._required
  }
  set required(req) {
    this._required = coerceBooleanProperty(req)
    this.stateChanges.next()
  }
  private _required = false

  @Input()
  get disabled(): boolean {
    return this._disabled
  }
  set disabled(value: boolean) {
    this._disabled = coerceBooleanProperty(value)
    this._disabled ? this.ctrl.disable() : this.ctrl.enable()
    this.stateChanges.next()
  }
  private _disabled = false

  get empty() {
    return !this.ctrl.value || this.ctrl.value.length === 0
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
    this.ctrl.valueChanges.pipe(takeUntil(this.destroy)).subscribe(onChange)
  }

  registerOnTouched(onTouched: () => void): void {
    this.onTouched = onTouched
  }

  onBlur() {
    this.isTouched = true
  }

  setDisabledState(shouldDisable: boolean): void {
    if (shouldDisable) {
      this.ctrl.disable()
    } else {
      this.ctrl.enable()
    }

    this.disabled = shouldDisable
  }

  writeValue(value: string[] | null): void {
    this.ctrl.setValue(value || [], {emitEvent: false})
  }

  // noinspection DuplicatedCode
  add(event: MatChipInputEvent): void {
    const tag = trimTag(event.value)
    console.log(`add ${tag}`)
    if (tag && this.value.indexOf(tag) === -1) {
      this.value.push(tag)
    }

    // Reset the input value
    if (event.chipInput.inputElement) {
      event.chipInput.inputElement.value = ''
    }
  }

  remove(tag: string): void {
    const index = this.value.indexOf(trimTag(tag))
    if (index >= 0) {
      this.value.splice(index, 1)
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const tag = trimTag(event.option.viewValue)
    console.log(`select ${tag}`)
    if (tag && this.value.indexOf(tag) === -1) {
      this.value.push(tag)
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
    return this.allTags
      .map(trimTag)
      .filter((tag) => tag.startsWith(trimTag(value)))
      .filter((tag) => this.value.indexOf(tag) === -1)
  }
}

function trimTag(tag: string | null): string {
  return (tag || '').toLowerCase().trim()
}
