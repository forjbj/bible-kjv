import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { BibleService } from '../bible.service';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent implements OnInit {

  constructor(private title: Title,
               private meta: Meta,
               private bibleService: BibleService) {
    title.setTitle('404 Not Found');
    this.meta.addTag({ name: 'description', content: 'The page does not exist.' });
    this.bibleService.pageTitle = "Nothing Here";


  }
  ngOnInit() {
  }

}
