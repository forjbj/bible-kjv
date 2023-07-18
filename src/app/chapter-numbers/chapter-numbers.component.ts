import { DOCUMENT } from '@angular/common';
import { AfterViewInit, Component, Inject, OnDestroy } from '@angular/core';
import { BibleService } from '../bible.service';
import { HistoryService } from '../history.service';

@Component({
  selector: 'app-chapter-numbers',
  templateUrl: './chapter-numbers.component.html',
  styleUrls: ['./chapter-numbers.component.scss']
})
export class ChapterNumbersComponent implements AfterViewInit, OnDestroy{

  private observer: any;

  constructor(public bibleService: BibleService,
              public historyService: HistoryService,
              @Inject(DOCUMENT) public document: Document, ) { }

  ngOnInit() {
    // apply righthanded if set in storage
    let gridSide = document.getElementById('chaptersShow') as HTMLInputElement;
    if (localStorage.getItem('leftHanded') == 'no'|| (localStorage.getItem('leftHanded') == null)) {
      gridSide.setAttribute('leftHanded', 'no');
    } else {
      gridSide.setAttribute('leftHanded', 'yes');
    }
  }      

  ngAfterViewInit() {
    // highlight chapters on scroll
    const chapters = this.document.querySelectorAll("section");
    const chaptersGrid = this.document.getElementsByClassName("chapters");
    const options = {
      root: null, // viewport
      threshold: [0],
      rootMargin: "-15% 0px -83% 0px", //only chapters at top-ish
    };
    this.observer = new IntersectionObserver( (entries) => {
    entries.forEach(entry => {
      if (entry.target.id)  { //necessary as sections used everywhere in semantic html
        let chapter = entry.target!.id!;
        let splits = chapter.split('-');
        let targetChapter = splits[2];
        if (entry.isIntersecting ) {
          chaptersGrid[Number(targetChapter)-1].classList.add("chapterScroll");
        } else {
          chaptersGrid[Number(targetChapter)-1].classList.remove("chapterScroll");
        }
        let current = Number(localStorage.getItem('curChap'))-1;
          //block: "nearest" is essential to stop page moving!
        chaptersGrid[current].scrollIntoView({block: "nearest"});
      }
    });
    },options);
      chapters.forEach(chapter=> {
      this.observer.observe(chapter);
    })  
  }
  ngOnDestroy() {
    this.observer.disconnect();
  }
  updateStorage(chapter:any){
    this.bibleService.chapterNumber = chapter;
    localStorage.setItem('curChap', chapter);
    localStorage.setItem('curVerse', '0');


  }
}
