import { Component, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormatterService } from './services/formatter.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public title = 'crkbd-keymap-formatter';
  public fileName = '';
  public formattedText: string | undefined;
  @Input() requiredFileType: string | undefined;

  constructor(private formatterService: FormatterService) { }

  public onFileSelected(event: any) {
    const file: File = event.target.files[0];

    if (file) {
      this.fileName = file.name;

      let formattedFile: File;

      file.text().then(
        (data) => {
          formattedFile = this.formatterService.format(data);
          this.saveAs(formattedFile);
          formattedFile.text().then((value) => this.formattedText = value);
        },
        (err) => console.error(`Reading file error: ${err}`)
      );
    }
  }

  private saveAs(file: File) {
    var a = document.createElement('a');
    a.href = URL.createObjectURL(file);
    a.download = file.name;
    a.click();
  }
}
