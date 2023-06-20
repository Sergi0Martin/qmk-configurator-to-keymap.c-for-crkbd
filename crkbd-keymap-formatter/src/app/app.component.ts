import { Component, Input } from '@angular/core';
import { FormatterService } from './services/formatter.service';
import { LayoutEnum } from './models/layoutEnum';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public title = 'crkbd-keymap-formatter';
  public fileName = '';
  public formattedText = '';
  public layoutTypes = Object.values(LayoutEnum);
  public selectedLayout: LayoutEnum = LayoutEnum.LayoutSplit3x6_3;
  @Input() requiredFileType: string | undefined;

  constructor(private formatterService: FormatterService) { }

  public onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (!this.isJSONFile(file)) {
      throw new Error('Not Json file!');
    }

    if (file) {
      this.fileName = file.name;

      let formattedFile: File;

      file.text().then(
        (data) => {
          formattedFile = this.formatterService.formatToFile(this.selectedLayout, data);
          this.saveAs(formattedFile);
          formattedFile.text().then((value) => this.formattedText = value);
        },
        (err) => console.error(`Reading file error: ${err}`)
      );
    }
  }

  private isJSONFile(file: File): boolean {
    return file.name.toLowerCase().endsWith('.json');
  }

  private saveAs(file: File) {
    var a = document.createElement('a');
    a.href = URL.createObjectURL(file);
    a.download = file.name;
    a.click();
  }
}
