import { AfterViewInit, Component, ChangeDetectionStrategy } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { BibleService } from '../bible.service';
import { Router } from '@angular/router';


@Component({
    selector: 'app-testaments',
    templateUrl: './testaments.component.html',
    styleUrls: ['./testaments.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class TestamentsComponent implements AfterViewInit {

  constructor(public bibleService: BibleService,
              public title: Title,
              private meta: Meta,
              private router: Router, ) {
    //nav titles and buttons
    this.bibleService.pageTitle = "KJV";
    this.bibleService.chapterButton = false;
    this.bibleService.spinner = false;

    this.title.setTitle('Bible Books');
    this.meta.addTag({ name: 'description', content: 'Select the Bible book to read' });

  }
  ngAfterViewInit() {}

  bookRender(testament: any, book: any, title: any) {
    this.bibleService.spinner = true;
    this.bibleService.spinnerTitle = "Rendering";
    this.bibleService.testament = testament;
    this.bibleService.bookSelected = book;
    this.bibleService.title = title;
    this.bibleService.displayMenu = false;
    this.bibleService.menuHistoryBook = false;

    let cur = JSON.parse(localStorage.getItem('recent1')!);
    if ((this.bibleService.testament == cur[0]) && (this.bibleService.bookSelected == cur[1])){
      this.bibleService.chapterNumber = cur[2];
      this.bibleService.verseNumber = cur[3];
    } else {
      this.bibleService.chapterNumber = 0;
      this.bibleService.verseNumber = 0; // if changing see also display-book.component.ts as it tests for this
    }
    //setTimeout needed for spinner to start
    setTimeout(() => {
      this.router.navigate(['book'], {fragment: this.bibleService.fragment()}); //works
    }, 10);

  }

}
