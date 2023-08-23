import { Component, OnInit, AfterViewInit, HostListener, ElementRef, ViewEncapsulation, Inject } from '@angular/core';
import { BibleService } from '../bible.service';
import * as wasm from '../../../pkg';
import { DomSanitizer, Meta, Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { DOCUMENT, ViewportScroller } from '@angular/common';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  encapsulation: ViewEncapsulation.None // removes ::ng-deep need
})
export class SearchComponent implements OnInit, AfterViewInit {

  public checkedNumber: number = 2;

  public worker?: any;

  testaments = [    
    { id: 0, label: "in Old Testament" },
    { id: 1, label: "in New Testament" },
    { id: 2, label: "in Old & New Testaments", selected: true}
  ]

  public accuracy: number = 0;

  accuracyLevel = [
    { id: 0, label: "results Contain Characters", selected: true },
    { id: 1, label: "results are Exact Match" },
  ]
  
  private observer: any;

  constructor(public bibleService: BibleService,
              public title: Title,
              public meta: Meta,
              public elementRef:ElementRef,
              private router: Router,
              private viewport: ViewportScroller,
              @Inject(DOCUMENT) public document: Document,
              public sanitizer: DomSanitizer ) { 
    //nav titles and buttons
    this.bibleService.pageTitle = "Search";
    this.bibleService.chapterButton = false;

    this.title.setTitle('Bible Search');
    this.meta.addTag({ name: 'description', content: 'Search for words in the bible offline; uses WebAssembly for faster results' });

    // Worker needs to be created immediately or will only work with double click
    if (typeof Worker !== 'undefined') {
      // Create a new
      this.worker = ( new Worker(new URL('./search.worker', import.meta.url)));
    }
  }
  ngOnInit(): void {
  }
  ngAfterViewInit(): void {
    //Scroll to last search place if exists
    //setTimeout necessary or angular auto scrolls to top
    setTimeout(() => {
    this.viewport.scrollToAnchor(localStorage.getItem('currentSearch')!);
    },100);

    if (this.bibleService.searchRan == true){
      setTimeout(() => {
        this.bibleService.spinner = false; //needed for reopening search page; MUST be in setTimeout or throws error in chrome
        this.saveSearchPosition();
      }, 300);
    }

  }
  ngAfterViewChecked() {
    //hack needed to add functionality to innerhtml from Rust/wasm
    if (!(this.elementRef.nativeElement.querySelector(".eventListenerAdded"))) { //check if this function has already run
      if (this.elementRef.nativeElement.querySelectorAll(".listResults")) {
        const res = this.elementRef.nativeElement.querySelectorAll(".listResults");
        res.forEach((element: any) => {
          element.addEventListener("click", () => { //must be arrow function or doesn't work; function contains 'this.' - apparently requires arrow function
            element.classList.add("eventListenerAdded"); //add empty class to test against; see above; - this is a terrible hack
            const splits = element.id.toString().split('-');
            this.bibleService.testament = Number(splits[0]);
            this.bibleService.bookSelected = Number(splits[1]);
            this.bibleService.title = this.bibleService.bible[this.bibleService.testament].books[this.bibleService.bookSelected].bookName 
            this.bibleService.showChapters = false;
            this.bibleService.displayMenu = false;
            let frag = element.id.toString();
            this.router.navigate(['./book'], {fragment: frag}); //works
            //the following is necessary or doesn't work;
            document.getElementById(frag)!.classList.add("activatedLink"); //necessary or doesn't work; thinking it's a timing thing
          });
        });
      }
    }
  }

  selectedTest() {
    this.checkedNumber = +this.checkedNumber;
  }
  selectedAccuracy() {
    this.accuracy = +this.accuracy;
  }
  submitSearch(req: string) {
    this.bibleService.spinner = true; // run spinner animation
    this.bibleService.spinnerTitle = "Searching";
    this.bibleService.searchRequest = req;
    this.bibleService.searchRan = true;
    
    localStorage.setItem('currentSearch', "0"); //reset search to stay at top; only works with viewport scroll below


    if (typeof Worker !== 'undefined') {
      this.worker = new Worker(new URL( './search.worker', import.meta.url));

      this.worker.onmessage = ({ data }: any) => {
        this.bibleService.searchResults = data;
        this.bibleService.spinner = false;
      };
      this.worker.postMessage(wasm.search(this.checkedNumber, req, this.accuracy));
    } else {
      // Web workers are not supported in this environment.
      console.log('threads not used');
      setTimeout(() => {
        this.bibleService.searchResults = wasm.search( this.checkedNumber, req, this.accuracy)
        this.bibleService.spinner = false;
      }, 10); // give it a moment to redraw
    }
    setTimeout(() => {
      this.saveSearchPosition();
      this.viewport.scrollToPosition([0,0]);//necessary as it will scroll to previously saved otherwise
    },500);

  }
  saveSearchPosition(){
            // save position on scroll
            const results = this.document.querySelectorAll("a");
            const options = {
              root: null, // viewport
              threshold: [0],
              rootMargin: "-15% 0px -83% 0px", //only top verse/s
              // delay: 300,
            };
            this.observer = new IntersectionObserver( (entries) => {
            entries.forEach(entry => {
              let searchId = (entry.target!.id) ?? "0"; 
              if (entry.isIntersecting ) {
                localStorage.setItem('currentSearch', searchId);
              }
            });
            },options);
              results.forEach(result=> {
              this.observer.observe(result);
            }) 
    
  }
  ngOnDestroy() {
    if (this.bibleService.searchRan == true){
      this.observer.disconnect();
    }
  }
}