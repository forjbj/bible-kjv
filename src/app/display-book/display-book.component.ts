import { Component, AfterViewInit, HostListener, Inject, ViewEncapsulation, OnDestroy } from '@angular/core';
import { BibleService } from '../bible.service';
import { HistoryService } from '../history.service';
import { Meta, Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import * as wasm from '../../../pkg';
import { ActivatedRoute } from '@angular/router';

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
        this.bibleService.title = this.bibleService.bible[frag[0]].books[frag[1]].bookName;
        this.bibleService.showChapters = false;
        this.fragString = fragment.toString();
        this.routedLink = true;
      } 
    }

    this.renderedBook = wasm.render(this.bibleService.testament, this.bibleService.bookSelected);

    if (this.routedLink == false) {
      this.historyService.newBook();
    }
    this.bibleService.pageTitle = this.bibleService.title;
    this.bibleService.chapterButton = true;
    this.bibleService.chapterNumber = localStorage.getItem('curChap') ?? "1";
  }   
  
  ngAfterViewInit() {
    //turn off spinner, setTimeout is necessary or doesn't work
    setTimeout(() => {
      this.bibleService.spinner = false;
    }, 10);
    
    // store book for loading on return, if not chosen from history -MUST BE UNDER ngAfterViewInit 
    this.historyService.storeBooks();

    // save chapters on scroll
    const chapters = this.document.querySelectorAll("section a");
    const options = {
      root: null, // viewport
      threshold: [0],
      rootMargin: "-50%" //highlight multiple chapters if visible
    };
    this.observer = new IntersectionObserver( (entries) => {
    entries.forEach(entry => {
      let chapter = (entry.target!.id) ?? "0"; 
      let splits = chapter.split('-');
      let scrollNumber: number;
      let targetChapter = splits[2];
      if (entry.isIntersecting ) {
         localStorage.setItem('curChap', targetChapter); 
         localStorage.setItem('curVerse', splits[3]); 
         this.bibleService.chapterNumber = targetChapter;  
         console.log(this.bibleService.showChapters);
      }

      let tabTitle = (this.bibleService.title).concat(' ',targetChapter);
      this.title.setTitle(tabTitle);

    });
    },options);
      chapters.forEach(chapter=> {
      this.observer.observe(chapter);
    }) 

    // add highlighting if come from link and scroll to it
    if (this.routedLink == true) {
      let target = document.getElementById(this.fragString!);
      target!.classList.add("activatedLink");
      target!.scrollIntoView({behavior: "smooth", block: "center", inline: "nearest"});
    } else { 
      //only scroll if not an outside link
      // THIS MUST GO HERE OR SCROLLING TO OLD POSITION DOESN'T WORK; 
      let current = this.bibleService.testament + '-' + this.bibleService.bookSelected + '-' + 
                    this.bibleService.chapterNumber + '-' + (localStorage.getItem("curVerse") ?? '1');
      document.getElementById(current)?.scrollIntoView({behavior: "smooth", block: "center", inline: "nearest"});
    }
  }

  ngOnDestroy() {
    this.observer.disconnect();
  }

}

