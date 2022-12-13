import { AfterViewInit, Component } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { BibleService } from '../bible.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-testaments',
  templateUrl: './testaments.component.html',
  styleUrls: ['./testaments.component.scss']
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
    //setTimeout needed for spinner to start
    setTimeout(() => {
      this.router.navigate(['book']); //works
    }, 10);
    
  }

}
