import { Component, AfterViewInit, Inject, ViewEncapsulation, OnDestroy, HostListener } from '@angular/core';
import { BibleService } from '../bible.service';
import { HistoryService } from '../history.service';
import { Meta, Title } from '@angular/platform-browser';
import { DOCUMENT, Location, ViewportScroller } from '@angular/common';
import * as wasm from '../../../pkg';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-display-book',
  templateUrl: './display-book.component.html',
  styleUrls: ['./display-book.component.scss'],
  encapsulation: ViewEncapsulation.None // removes ::ng-deep need
})
export class DisplayBookComponent implements AfterViewInit, OnDestroy {

public renderedBook: string ;

public fragString?: string;

private observer: any;


  constructor( public bibleService: BibleService,
               public historyService: HistoryService,
               public title: Title,
               public meta: Meta, 
               public router: Router,
               private location: Location,
               private viewport: ViewportScroller,
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
      } 
    }

    this.renderedBook = wasm.render(this.bibleService.testament, this.bibleService.bookSelected);

    this.bibleService.pageTitle = this.bibleService.title;
    this.bibleService.chapterButton = true;

    // Only auto open chapters if new book and history isn't populated; new uses only
    let historyPopulated = localStorage.getItem('thirdTestamentIndex')!;
    if (this.bibleService.verseNumber == '' && this.bibleService.chapterNumber == '1' && (historyPopulated  == null || historyPopulated == 'null')) {
      this.bibleService.showChapters = true;
    }
  }   
  
  ngAfterViewInit() {
    
    //turn off spinner, setTimeout is necessary or doesn't work
    setTimeout(() => {
      this.bibleService.spinner = false;
    }, 10);
    
    // store book for loading on return, if not chosen from history -MUST BE UNDER ngAfterViewInit 
      this.historyService.storeBooks();

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
      let url = "/book#";
      if (entry.isIntersecting ) {
         localStorage.setItem('curVerse', splits[3]);
         this.bibleService.verseNumber = splits[3]; 
         localStorage.setItem('curChap', targetChapter); 
         this.bibleService.chapterNumber = targetChapter;
         this.location.go(url.concat(chapter)); //update url on scroll to ensure place if reloaded

         let tabTitle = (this.bibleService.title).concat(' ',targetChapter);
         this.title.setTitle(tabTitle);   
      }
    });
    },options);
      chapters.forEach(chapter=> {
      this.observer.observe(chapter);
    }) 
    localStorage.setItem('curTestamentIndex', this.bibleService.testament.toString());
    localStorage.setItem('curBookIndex', this.bibleService.bookSelected.toString());
    localStorage.setItem('curChap', this.bibleService.chapterNumber);
    localStorage.setItem('curVerse', this.bibleService.verseNumber);

    if (this.bibleService.chapterNumber == '1' && this.bibleService.verseNumber == '') { //Don't change without changing testaments.components.ts as well
      this.viewport.scrollToPosition([0,0]);
    } else {
      this.router.navigate(['book'], {fragment: this.bibleService.fragment()}); //works
    }

    screen.orientation.onchange = () => {
      let frag = this.bibleService.fragment();//must be worked out first
      // console.log(screen.orientation.type);
      setTimeout(()=>{
        this.viewport.scrollToAnchor(frag);//setTimeout absolutely necessary as browsers make a mess of it otherwise
      }, 900);//needs to be this slow (maybe slower??) depending on device and book size
  };

  }
  // @HostListener('window:resize', []) // DON'T USE THIS; messes up the screen on mobile devices with dynamic url bars

  ngOnDestroy() {
    this.observer.disconnect();
  }
}

