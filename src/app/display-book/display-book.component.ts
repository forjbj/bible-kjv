import { Component, AfterViewInit, HostListener, Inject, ViewEncapsulation, OnDestroy } from '@angular/core';
import { BibleService } from '../bible.service';
import { HistoryService } from '../history.service';
import { Meta, Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import * as wasm from '../../../pkg';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-display-book',
  templateUrl: './display-book.component.html',
  styleUrls: ['./display-book.component.scss'],
  encapsulation: ViewEncapsulation.None // removes ::ng-deep need
})
export class DisplayBookComponent implements AfterViewInit, OnDestroy {

public renderedBook: string ;

public fragString?: string;

public routedLink = false; //Needed to test for outside links including search link

private observer: any;


  constructor( public bibleService: BibleService,
               public historyService: HistoryService,
               public title: Title,
               public meta: Meta, 
               public router: Router,
               @Inject(DOCUMENT) public document: Document,
               private activatedRoute: ActivatedRoute, ) { 
              
    this.bibleService.spinner = true;
    this.bibleService.spinnerTitle = "Rendering";

    this.meta.addTag({ name: 'description', content: 'King James Version (Cambridge) Bible; utilising WebAssembly for speed.' });
    title.setTitle('Bible - King James Version - PWA');

    let fragment = this.activatedRoute.snapshot.fragment;
    if (fragment){
      let frag = fragment.split('-')
      if (frag.length > 3){ // only if verse exists in route
        this.bibleService.testament = Number(frag[0]);
        this.bibleService.bookSelected = Number(frag[1]);
        this.bibleService.chapterNumber = frag[2];
        this.bibleService.verseNumber = frag[3];
        this.bibleService.title = this.bibleService.bible[frag[0]].books[frag[1]].bookName;
        this.bibleService.showChapters = false;
        this.fragString = fragment.toString();
        this.routedLink = true;
      } 
    }

    this.renderedBook = wasm.render(this.bibleService.testament, this.bibleService.bookSelected);

    this.bibleService.pageTitle = this.bibleService.title;
    this.bibleService.chapterButton = true;

    if (this.bibleService.verseNumber == '0' && this.bibleService.chapterNumber == '1') {
      this.bibleService.showChapters = true;
    }
  }   
  
  ngAfterViewInit() {
    
    //turn off spinner, setTimeout is necessary or doesn't work
    setTimeout(() => {
      this.bibleService.spinner = false;
    }, 10);
    
    // store book for loading on return, if not chosen from history -MUST BE UNDER ngAfterViewInit 
    if (this.routedLink == true) {
      this.historyService.storeBooks();
    }

    // save chapter and verse on scroll
    const chapters = this.document.querySelectorAll("section > a");
    const options = {
      root: null, // viewport
      threshold: [0],
      rootMargin: "-15% 0px -83% 0px", //only top verse/s
      // delay: 300,
    };
    this.observer = new IntersectionObserver( (entries) => {
    entries.forEach(entry => {
      let chapter = (entry.target!.id) ?? "0"; 
      let splits = chapter.split('-');
      let targetChapter = splits[2];
      if (entry.isIntersecting ) {
        //only when user scrolls; set to '1' on chapter click - see chapter-numbers component
        // window.onscroll = (e) => {  
         localStorage.setItem('curVerse', splits[3]);
         this.bibleService.verseNumber = splits[3]; 
         localStorage.setItem('curChap', targetChapter); 
         this.bibleService.chapterNumber = targetChapter; 
        // } 
      }

      let tabTitle = (this.bibleService.title).concat(' ',targetChapter);
      this.title.setTitle(tabTitle);

    });
    },options);
      chapters.forEach(chapter=> {
      this.observer.observe(chapter);
    }) 
    localStorage.setItem('curTestamentIndex', this.bibleService.testament.toString());
    localStorage.setItem('curBookIndex', this.bibleService.bookSelected.toString());
    localStorage.setItem('curChap', this.bibleService.chapterNumber);
    localStorage.setItem('curVerse', this.bibleService.verseNumber);

    this.router.navigate(['book'], {fragment: this.bibleService.fragment()}); //works

  }

  ngOnDestroy() {
    this.observer.disconnect();
  }
}

