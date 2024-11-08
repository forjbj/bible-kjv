import { Component, AfterViewInit, Inject, ViewEncapsulation, OnDestroy } from '@angular/core';
import { BibleService } from '../bible.service';
import { HistoryService } from '../history.service';
import { Meta, Title } from '@angular/platform-browser';
import { DOCUMENT, Location } from '@angular/common';
import * as wasm from '../../../pkg';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-display-book',
  templateUrl: './display-book.component.html',
  styleUrls: ['./display-book.component.scss'],
  encapsulation: ViewEncapsulation.None, // removes ::ng-deep need

})
export class DisplayBookComponent implements AfterViewInit, OnDestroy {

public renderedBook: string ;

public fragString?: string;
public fragment?: any;
public frag?: any;

private observer: any;


  constructor( public bibleService: BibleService,
               public historyService: HistoryService,
               public title: Title,
               public meta: Meta, 
               public router: Router,
               private location: Location,
               @Inject(DOCUMENT) public document: Document,
               private activatedRoute: ActivatedRoute, ) { 

              
    this.bibleService.spinner = true;
    this.bibleService.spinnerTitle = "Rendering";

    this.meta.addTag({ name: 'description', content: 'King James Version (Cambridge) Bible; utilising WebAssembly for speed.' });
    title.setTitle('Bible - King James Version - PWA');

    this.fragment = this.activatedRoute.snapshot.fragment;
    if (this.fragment){
      this.frag = this.fragment.split('-')
      if (this.frag.length > 3){ // only if verse exists in route
        this.bibleService.testament = Number(this.frag[0]);
        this.bibleService.bookSelected = Number(this.frag[1]);
        this.bibleService.chapterNumber = this.frag[2];
        this.bibleService.verseNumber = this.frag[3];
        this.bibleService.title = this.bibleService.bible[this.frag[0]].books[this.frag[1]].bookName;
        this.bibleService.showChapters = false;
        this.fragString = this.fragment.toString();
      } 
    }

    this.renderedBook = wasm.render(this.bibleService.testament, this.bibleService.bookSelected);

    this.bibleService.pageTitle = this.bibleService.title;
    this.bibleService.chapterButton = true;

    // Only auto open chapters if new book and history isn't populated; new uses only
    let historyPopulated = localStorage.getItem('secTestamentIndex')!;
    if (this.bibleService.verseNumber == '' && this.bibleService.chapterNumber == '1' && (historyPopulated  == null || historyPopulated == 'null')) {
      this.bibleService.showChapters = true;
    }

  }   
  
  ngAfterViewInit() {
    
    //turn off spinner, setTimeout is necessary or doesn't work
    setTimeout(() => {
      this.bibleService.spinner = false;
    }, 10);
    
    // if (this.fragment && this.frag.length > 3){ // only if verse exists in route
    //   let position = this.document.getElementById(this.frag);
    //   position?.scrollIntoView({behavior: 'smooth'});
    // };

    // store book for loading on return, if not chosen from history -MUST BE UNDER ngAfterViewInit 
    this.historyService.storeBooks();

    let id = this.bibleService.fragment();//must be worked out first
    if (this.bibleService.chapterNumber == '1' && this.bibleService.verseNumber == ('' || '1')) { //Don't change without changing testaments.components.ts as well
      window.scrollTo(0, 0);
    } else {
      let bookPlace = this.document.getElementById(id);
      bookPlace?.focus();
      bookPlace?.scrollIntoView({behavior: 'instant'}); //instant needed to stop observer changing verse and chapter number

      localStorage.setItem('curTestamentIndex', this.bibleService.testament.toString());
      localStorage.setItem('curBookIndex', this.bibleService.bookSelected.toString());
      localStorage.setItem('curChap', this.bibleService.chapterNumber);
      localStorage.setItem('curVerse', this.bibleService.verseNumber);
    }

    this.saveScrollposition();

    screen.orientation.addEventListener("change", (event) => {
      let id = this.bibleService.fragment();
      let bookPlace = this.document.getElementById(id);
      bookPlace?.focus();
      bookPlace?.scrollIntoView({behavior:'instant'});
    })
  }
  ngOnDestroy() {
    this.observer.disconnect();
  }

  saveScrollposition(){
        // save chapter and verse on scroll
        const chapters = this.document.querySelectorAll("section > a");
        const options = {
          root: null, // viewport
          threshold: [0],
          rootMargin: "-4% 0px -94% 0px", //only top verse/s Don't change these affects reloading at correct verse
          delay: 700, //only works on safari
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
    
  }
}

