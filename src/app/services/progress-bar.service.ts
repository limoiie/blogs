import {Injectable} from '@angular/core'
import {ProgressBarMode} from '@angular/material/progress-bar'

@Injectable({
  providedIn: 'root'
})
export class ProgressBarService {
  private mMode: ProgressBarMode = 'query'
  private mLoading = false
  private mBufferValue = 0
  private mValue = 0

  get mode() {
    return this.mMode
  }

  get loading() {
    return this.mLoading
  }

  get bufferValue() {
    return this.mBufferValue
  }

  get value() {
    return this.mValue
  }

  determinate(value: number) {
    this.mLoading = true
    this.mMode = 'determinate'
    this.mValue = value
  }

  indeterminate() {
    this.mLoading = true
    this.mMode = 'indeterminate'
  }

  query() {
    this.mLoading = true
    this.mMode = 'query'
  }

  buffer(value: number, bufferValue: number) {
    this.mLoading = true
    this.mMode = 'buffer'
    this.mValue = value
    this.mBufferValue = bufferValue
  }

  stop() {
    this.mLoading = false
  }
}
