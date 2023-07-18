import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { IOption } from '../model';

@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.less'],
})
export class OptionsComponent implements OnInit {
  @Input() set options(value: IOption) {
    this.optionForm.setValue(value, { emitEvent: false });
    if (!value.tempDetector) {
      this.tempLowControl.disable();
      this.tempHightControl.disable();
    }
  }

  @Output() optionChange = new EventEmitter<IOption>();

  optionForm = this._fb.group({
    rainDetector: [null, Validators.required],
    tempDetector: [null, Validators.required],
    tempLow: [null, Validators.required],
    tempHight: [null, Validators.required],
    timeRatio: [null, Validators.required],
  });

  get tempDetectorControl() {
    return this.optionForm.get('tempDetector');
  }

  get tempLowControl() {
    return this.optionForm.get('tempLow');
  }

  get tempHightControl() {
    return this.optionForm.get('tempHight');
  }

  constructor(private _fb: UntypedFormBuilder) {}

  ngOnInit(): void {
    this.optionForm.valueChanges
      .pipe(debounceTime(100))
      .subscribe((event: IOption) => {
        this.optionChange.emit(this.optionForm.getRawValue());
      });

    this.tempDetectorControl.valueChanges.subscribe((event) => {
      event ? this.tempLowControl.enable() : this.tempLowControl.disable();
      event ? this.tempHightControl.enable() : this.tempHightControl.disable();
    });
  }
}
