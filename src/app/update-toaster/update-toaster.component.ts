import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-update-toaster',
    templateUrl: './update-toaster.component.html',
    styleUrls: ['./update-toaster.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class UpdateToasterComponent {
  
  @Input() showUpdate = false;

  reload() {
    document.location.reload();
  }
}
