import { Component, OnInit, AfterViewInit, ElementRef, ViewEncapsulation, Inject } from '@angular/core';
import { BibleService } from '../bible.service';
import { SearchService } from '../search.service';
import { DomSanitizer, Meta, Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  encapsulation: ViewEncapsulation.None, // removes ::ng-deep need

})
export class SearchComponent implements OnInit, AfterViewInit {


  constructor(public bibleService: BibleService,
              public searchService: SearchService,
              public title: Title,
              public meta: Meta,
              private router: Router,
              @Inject(DOCUMENT) public document: Document,
              public sanitizer: DomSanitizer ) { 
    //nav titles and buttons
    this.bibleService.pageTitle = "Search";
    this.bibleService.chapterButton = false;
    this.bibleService.searchRan = true;
    this.title.setTitle('Bible Search');
    this.meta.addTag({ name: 'description', content: 'Search for words in the bible offline; uses WebAssembly for faster results' });

  }
  ngOnInit(): void {
  }
  ngAfterViewInit(): void {
    // Below is needed to stop refresh page from opening to empty search results
    if (this.bibleService.searchResults == 'noSearchYet'){
      this.router.navigate(['book']);
    }
  }
  ngOnDestroy() {
    if (this.bibleService.searchResults != 'noSearchYet'){
      this.searchService.searchObserver.disconnect();
    }
  }
}