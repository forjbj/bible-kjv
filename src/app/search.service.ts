import { Injectable } from '@angular/core';
import { Component, OnInit, AfterViewInit, HostListener, ElementRef, ViewEncapsulation, Inject } from '@angular/core';
import { BibleService } from './bible.service';
import * as wasm from './../../pkg';
import { DomSanitizer, Meta, Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { DOCUMENT, ViewportScroller } from '@angular/common';
@Injectable({
  providedIn: 'root'
})
export class SearchService {

  public checkedNumber: number = 0;

  public worker?: any;

  searchArea = [    
    { id: 0, label: "in Old & New Testaments", selected: true},
    { id: 1, label: "in Old Testament" },
    { id: 2, label: "in New Testament" },
    { id: 3, label: "in specific Book" },
  ]

  public specific: number = 100; //need to initialize this high so as it is ignored by rust search if not used
  public accuracy: number = 0;

  accuracyLevel = [
    { id: 0, label: "results Contain Characters", selected: true },
    { id: 1, label: "results are Exact Match" },
  ]
  
  public searchObserver: any;

  constructor(public bibleService: BibleService,
              public title: Title,
              public meta: Meta,
              public router: Router,
              private viewport: ViewportScroller,
              @Inject(DOCUMENT) public document: Document,
              public sanitizer: DomSanitizer ) { 

    // Worker needs to be created immediately or will only work with double click
    if (typeof Worker !== 'undefined') {
      // Create a new
      this.worker = ( new Worker(new URL('./search.worker', import.meta.url)));
    }
  }

  selectedArea() {
    this.checkedNumber = +this.checkedNumber;
  }
  selectedAccuracy() {
    this.accuracy = +this.accuracy;
  }
  submitSearch(req: string) {
    this.bibleService.spinner = true; // run spinner animation
    this.bibleService.spinnerTitle = "Searching";
    this.bibleService.searchRequest = req;
    
    localStorage.setItem('currentSearch', "0"); //reset search Y position to stay at top; only works with viewport scroll below

    if (typeof Worker !== 'undefined') {
      this.worker = new Worker(new URL( './search.worker', import.meta.url));

      this.worker.onmessage = ({ data }: any) => {
        this.bibleService.searchResults = data;
      };
      this.worker.postMessage(wasm.search(this.checkedNumber, req, this.accuracy));
    } else {
      // Web workers are not supported in this environment.
      console.log('threads not used');
      this.bibleService.searchResults = wasm.search( this.checkedNumber, req, this.accuracy)
    };
    
    this.routeToSearch();

    //setTimeout is necessary to force it to wait to run
    setTimeout(() => {
      this.resultsSet();
    }, 500)
  }
  routeToSearch(){
      this.bibleService.showChapters = false;
      this.bibleService.menuHistoryBook = false;
      this.bibleService.displayMenu = false;
      this.bibleService.searchResults = "Searching..."
      this.bibleService.spinnerTitle = "Searching";
      this.router.navigate(['search']); //Do Not use fragment as it confuses angular router if user selects 'Word Search' from menu while already at that route
  }
  resultsSet(){
    let listResultsAdded = this.document.querySelectorAll(".listResults");

    if (listResultsAdded.length > 0) {
      listResultsAdded.forEach((element: any) => {
        element.addEventListener("click", () => { //must be arrow function or doesn't work; function contains 'this.' - apparently requires arrow function
          // element.classList.add("eventListenerAdded"); //add empty class to test against; see above; - this is a terrible hack
          const splits = element.id.toString().split('-');
          this.bibleService.testament = Number(splits[0]);
          this.bibleService.bookSelected = Number(splits[1]);
          this.bibleService.title = this.bibleService.bible[this.bibleService.testament].books[this.bibleService.bookSelected].bookName 
          this.bibleService.showChapters = false;
          this.bibleService.displayMenu = false;
          let frag = element.id.toString();
          this.router.navigate(['./book'], {fragment: frag}); //works
          //the following is necessary or doesn't work;
          setTimeout( () => {
            document.getElementById(frag)!.classList.add("activatedLink");
          },0)
        });
      });
      let current = localStorage.getItem('currentSearch');
      let searchPosition:any;
      if (current){
        searchPosition = this.document.getElementById(current);
      }
      if (searchPosition){
        searchPosition.scrollIntoView({behavior: 'smooth'});
      }
      this.saveSearchPosition()

    }
    this.bibleService.spinner = false;
  }
  saveSearchPosition(){
    // save position on scroll
    const results = this.document.querySelectorAll("section > a");
    const options = {
      root: null, // viewport
      threshold: [0],
      rootMargin: "-20% 0px -65% 0px", //needs to be this wide as doesn't work otherwise; because of search form above it?
      delay: 300, // only works in iOS
    };
    this.searchObserver = new IntersectionObserver( (entries) => {
    entries.forEach(entry => {
      let searchId = (entry.target!.id) ?? "0"; 
      if (entry.isIntersecting ) {
        localStorage.setItem('currentSearch', searchId);
        // console.log(searchId)
      }
    });
    },options);
      results.forEach(result=> {
      this.searchObserver.observe(result);
    }) 

  }
}
