import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { BibleService } from '../bible.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

  constructor(public bibleService: BibleService,
              public title: Title,
              public meta: Meta,) {
    //nav titles and buttons
    this.bibleService.pageTitle = "About";
    this.bibleService.chapterButton = false;
    this.bibleService.spinner = false;
    
    this.title.setTitle('About');
    this.meta.addTag({ name: 'description', content: 'About this Application; including version history and repository location' });

   }

  ngOnInit(): void {
  }

}
