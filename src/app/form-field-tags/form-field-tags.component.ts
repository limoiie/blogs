import {
  AfterViewInit,
  Component,
  ElementRef,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  Self,
  ViewChild
} from '@angular/core';
import {ControlValueAccessor, FormBuilder, FormGroup, NgControl} from '@angular/forms';
import {MatFormFieldControl} from '@angular/material/form-field';
import {combineLatest, Observable, Subject} from 'rxjs';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatAutocomplete, MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {MatChipInputEvent} from '@angular/material/chips';
import {FocusMonitor} from '@angular/cdk/a11y';
import {coerceBooleanProperty} from '@angular/cdk/coercion';
import {map, startWith, takeUntil} from 'rxjs/operators';
import {AutofillMonitor} from '@angular/cdk/text-field';

@Component({
  selector: 'app-form-field-tags',
  templateUrl: './form-field-tags.component.html',
  styleUrls: ['./form-field-tags.component.css'],
  providers: [{
    provide: MatFormFieldControl,
    useExisting: FormFieldTagsComponent
  }]
})
export class FormFieldTagsComponent implements OnInit, AfterViewInit, OnDestroy,
  MatFormFieldControl<string[]>, ControlValueAccessor {

  @Input()
  get value() {
    if (this.parts.value.tags == null ||
      this.parts.value.tags.trim() === '') {
      return [];
    }
    return this.parts.value.tags.split(';');
  }

  set value(val) {
    val = val || [];
    this.parts.setValue({tags: val.join(';')});
    this.stateChanges.next();
  }

  @Input()
  get placeholder() {
    return this._placeholder;
  }

  set placeholder(plh) {
    this._placeholder = plh;
    this.stateChanges.next();
  }

  @Input()
  get required() {
    return this._required;
  }

  set required(req) {
    this._required = coerceBooleanProperty(req);
    this.stateChanges.next();
  }

  @Input()
  get disabled(): boolean {
    return this._disabled;
  }

  set disabled(value: boolean) {
    this._disabled = coerceBooleanProperty(value);
    this._disabled ? this.parts.disable() : this.parts.enable();
    this.stateChanges.next();
  }

  constructor(
    fb: FormBuilder,
    @Optional() @Self() public ngControl: NgControl,
    private fm: FocusMonitor,
    private elRef: ElementRef<HTMLElement>,
    private autofillMonitor: AutofillMonitor,
  ) {
    this.parts = fb.group({
      tags: []
    });
    if (this.ngControl != null) {
      // Setting the value accessor directly (instead of using
      // the providers) to avoid running into a circular import.
      this.ngControl.valueAccessor = this;
    }

    fm.monitor(elRef.nativeElement, true).subscribe(origin => {
      this.focused = !!origin;
      this.stateChanges.next();
    });
  }

  static nextId = 0;

  parts: FormGroup;

  @ViewChild('fruitInput') fruitInput: ElementRef<HTMLInputElement>;
  @ViewChild('realInput') realInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  filteredTags: Observable<string[]>;
  separatorKeysCodes: number[] = [ENTER, COMMA];

  @HostBinding() id = `tags-input-${FormFieldTagsComponent.nextId++}`;

  stateChanges = new Subject<void>();
  destroy = new Subject<void>();

  // tslint:disable-next-line:variable-name
  private _placeholder: string;
  // tslint:disable-next-line:variable-name
  private _required = false;
  // tslint:disable-next-line:variable-name
  private _disabled = false;

  focused = false;
  errorState = false;
  controlType = 'tags-input';
  autofilled = false;


  @HostBinding('attr.aria-describedby') describedBy = '';

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.fm.monitor(this.elRef.nativeElement, true)
      .subscribe(focusOrigin => {
        this.focused = !!focusOrigin;
      });
    combineLatest(
      this.observeAutofill(this.fruitInput)
    ).pipe(
      map(autofill => autofill.some(autofilled => autofilled)),
      takeUntil(this.destroy),
    ).subscribe(autofilled => this.autofilled = autofilled);
  }

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.complete();
    this.stateChanges.complete();
    this.fm.stopMonitoring(this.elRef.nativeElement);
    this.autofillMonitor.stopMonitoring(this.fruitInput);
  }

  get empty() {
    const n = this.parts.value;
    return !n.tags;
  }

  @HostBinding('class.floating')
  get shouldLabelFloat() {
    return this.focused || !this.empty;
  }

  setDescribedByIds(ids: string[]) {
    this.describedBy = ids.join(' ');
  }

  onContainerClick(event: MouseEvent) {
    if ((event.target as Element).tagName.toLowerCase() !== 'input') {
      this.elRef.nativeElement.querySelector('input').focus();
    }
  }

  onTouched(): void {
  }

  registerOnChange(onChange: (value: string[] | null) => void): void {
    this.parts.valueChanges.pipe(
      takeUntil(this.destroy),
    ).subscribe(onChange);
  }

  registerOnTouched(onTouched: () => void): void {
    this.onTouched = onTouched;
  }

  setDisabledState(shouldDisable: boolean): void {
    if (shouldDisable) {
      this.parts.disable();
    } else {
      this.parts.enable();
    }

    this.disabled = shouldDisable;
  }

  writeValue(value: string[] | null): void {
    value = value || [];

    this.parts.setValue(
      {tags: value.join(';')}, {emitEvent: false});
  }

  private observeAutofill(ref: ElementRef): Observable<boolean> {
    return this.autofillMonitor.monitor(ref)
      .pipe(map(event => event.isAutofilled))
      .pipe(startWith(false));
  }

  // noinspection DuplicatedCode
  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value.toLowerCase();

    const tags = this.value;

    // Add our fruit
    if ((value || '').trim()) {
      if (tags.indexOf(value.trim()) === -1) {
        tags.push(value.trim());
        this.value = tags;
      }
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }

    // this.tagCtrl.setValue(null);
  }

  remove(tag: string): void {
    const value = tag.toLowerCase();
    const index = this.value.indexOf(value);

    const tags = this.value;

    if (index >= 0) {
      tags.splice(index, 1);
      this.value = tags;
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const value = event.option.viewValue.toLowerCase();

    const tags = this.value;

    if (tags.indexOf(value) === -1) {
      tags.push(value);
      this.value = tags;
    }

    this.fruitInput.nativeElement.value = '';
    // this.tagCtrl.setValue(null);
  }

}
