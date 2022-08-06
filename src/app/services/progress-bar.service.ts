import {Injectable} from '@angular/core'
import {ProgressBarMode} from '@angular/material/progress-bar'

@Injectable({
  providedIn: 'root'
})
export class ProgressBarService {
  mode: ProgressBarMode = 'query'
  loading = false
  bufferValue = 0
  value = 0
}
