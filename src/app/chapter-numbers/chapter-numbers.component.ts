import { DOCUMENT } from '@angular/common';
import { AfterViewInit, Component, Inject } from '@angular/core';
import { BibleService } from '../bible.service';
import { HistoryService } from '../history.service';

@Component({
  selector: 'app-chapter-numbers',
  templateUrl: './chapter-numbers.component.html',
  styleUrls: ['./chapter-numbers.component.scss']
})
export class ChapterNumbersComponent implements AfterViewInit{

  private observer: any;

  constructor(public bibleService: BibleService,
              public historyService: HistoryService,
              @Inject(DOCUMENT) public document: Document, ) { }

  ngAfterViewInit() {
    // highlight chapters on scroll
    const chapters = this.document.querySelectorAll("section");
    const chaptersGrid = this.document.getElementsByClassName("chapters");
    const options = {
      root: null, // viewport
      threshold: [0],
      rootMargin: "-50%" //highlight multiple chapters if visible
    };
    this.observer = new IntersectionObserver(function (entries) {
    entries.forEach(entry => {
      let chapter = entry.target.querySelector("div")!.id!; 
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
    });
    },options);
      chapters.forEach(chapter=> {
      this.observer.observe(chapter);
    })  
  }
  ngOnDestroy() {
    this.observer.disconnect();
  }

}
