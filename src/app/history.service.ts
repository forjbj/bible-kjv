import { Injectable } from '@angular/core';
import { BibleService } from './bible.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class HistoryService {

  public curTheme:string = "light";

  public curBookMenu?: string; // "?" for typescript to allow undefined
  public secBookMenu?: string | null;
  public thirdBookMenu?: string | null;

  public curChap?: string;
  public secChap?: string;
  public thirdChap?: string;

  public curVerse?: string;
  public secVerse?: string;
  public thirdVerse?: string;

  public curBookArr?: string;
  public curTestamentArr?: string;
  public secBookArr?: string;
  public secTestamentArr?: string;
  public thirdBookArr?: string | null;
  public thirdTestamentArr?: string | null;

  constructor( public bibleService: BibleService,
              public router: Router) { } 

  menuBooks() {
    this.curTheme =  localStorage.getItem('theme') ?? "light";
    let secTestInd = localStorage.getItem('secTestamentIndex')!;
    let thirdTestInd = localStorage.getItem('thirdTestamentIndex')!;
    // console.log(thirdTestInd);

    this.curBookMenu = this.bibleService.bible[this.bibleService.testament].books[this.bibleService.bookSelected].bookName
    + ' '  + this.bibleService.chapterNumber ;
    if ((secTestInd != 'null') && (secTestInd != null)) { // NO idea why javascript does this; could be either depending on how you hold your tongue
      this.secBookMenu = this.bibleService.bible[Number(secTestInd)].books[Number(localStorage.getItem('secBookIndex'))].bookName
      + ' ' + localStorage.getItem('secChap') ;
    }
    if (thirdTestInd != 'null' && thirdTestInd != null ) {
      this.thirdBookMenu = this.bibleService.bible[Number(thirdTestInd)].books[Number(localStorage.getItem('thirdBookIndex'))].bookName
      + ' ' + localStorage.getItem('thirdChap') ;
    }
  }

  rearrangeBooks(book:string) {
    this.curTestamentArr = localStorage.getItem('curTestamentIndex')!; // "!" for typescript to allow undefined
    this.curBookArr = localStorage.getItem('curBookIndex')!;
    this.curChap = localStorage.getItem('curChap')!;
    this.curVerse = localStorage.getItem('curVerse')!;
    this.secTestamentArr = localStorage.getItem('secTestamentIndex')!;
    this.secBookArr = localStorage.getItem('secBookIndex')!;
    this.secChap = localStorage.getItem('secChap')!;
    this.secVerse = localStorage.getItem('secVerse')!;

    this.bibleService.menuHistoryBook = true;
    this.bibleService.showChapters = false;
    this.bibleService.displayMenu = false;
    this.bibleService.spinner = true;
    this.bibleService.spinnerTitle = "Restoring"
    
    switch (book) {
      case 'cur':
        break;
      
      case 'sec':

        this.bibleService.testament = Number(this.secTestamentArr);
        this.bibleService.bookSelected = Number(this.secBookArr);
        this.bibleService.chapterNumber = this.secChap;
        this.bibleService.verseNumber = this.secVerse;

        localStorage.setItem('secTestamentIndex', this.curTestamentArr);
        localStorage.setItem('secBookIndex', this.curBookArr);
        localStorage.setItem('secChap', this.curChap);
        localStorage.setItem('secVerse', this.curVerse);

        break;
        
      case 'third':

        this.bibleService.testament = Number(localStorage.getItem('thirdTestamentIndex'));
        this.bibleService.bookSelected = Number(localStorage.getItem('thirdBookIndex'));
        this.bibleService.chapterNumber = localStorage.getItem('thirdChap')!;
        this.bibleService.verseNumber = localStorage.getItem('thirdVerse')!;

        localStorage.setItem('secTestamentIndex', this.curTestamentArr);
        localStorage.setItem('secBookIndex', this.curBookArr);
        localStorage.setItem('secChap', this.curChap);
        localStorage.setItem('secVerse', this.curVerse);

        localStorage.setItem('thirdTestamentIndex', this.secTestamentArr);
        localStorage.setItem('thirdBookIndex', this.secBookArr);
        localStorage.setItem('thirdChap', this.secChap);
        localStorage.setItem('thirdVerse', this.secVerse);

        break;
    };
    this.bibleService.title = this.bibleService.bible[this.bibleService.testament].books[this.bibleService.bookSelected].bookName;
    localStorage.setItem('curTestamentIndex', (this.bibleService.testament).toString());
    localStorage.setItem('curBookIndex', (this.bibleService.bookSelected).toString());
    localStorage.setItem('curChap', this.bibleService.chapterNumber!);
    localStorage.setItem('curVerse', this.bibleService.verseNumber!);
    this.bibleService.spinnerTitle = "Restoring";
   
    /*
      hack to force angular to reload with the above parameters - route to '/testament' then back
      Gives brief 404 error in tab title when selecting from menu - history; but corrects on loaded page
    */
    setTimeout(() => {
      this.router.navigateByUrl('./testament', { skipLocationChange: true }).then(() => {
      /*
        Below works, however gives an error code 404 from static server (github pages) on 
        reload if - this.router.navigate(['/book', this.bibleService.title]);  
      */
        this.router.navigate(['book'], {fragment: this.bibleService.fragment()});  
      }); 
    }, 10); 
  }

  storeBooks() {
    // only execute if not selected from history
    if (this.bibleService.menuHistoryBook == false) {

      this.curTestamentArr = localStorage.getItem('curTestamentIndex')!;
      this.secTestamentArr = localStorage.getItem('secTestamentIndex')!;
      this.curBookArr = localStorage.getItem('curBookIndex')!;
      this.secBookArr = localStorage.getItem('secBookIndex')!;
      this.curChap = localStorage.getItem('curChap')!;
      this.secChap = localStorage.getItem('secChap')!;
      this.curVerse = localStorage.getItem('curVerse')!;
      this.secVerse = localStorage.getItem('secVerse')!;

      if (this.bibleService.bookSelected != Number(this.curBookArr) 
          || this.bibleService.testament != Number(this.curTestamentArr) ) { 
        if (this.secTestamentArr != 'null') {
          localStorage.setItem('thirdTestamentIndex', this.secTestamentArr);
          localStorage.setItem('thirdBookIndex', this.secBookArr);
          localStorage.setItem('thirdChap', this.secChap);
          localStorage.setItem('thirdVerse', this.secVerse);
        }
        localStorage.setItem('secTestamentIndex', this.curTestamentArr);
        localStorage.setItem('secBookIndex', this.curBookArr);
        localStorage.setItem('secChap', this.curChap);
        localStorage.setItem('secVerse', this.curVerse);
      }
      // The following need to be here or history won't originally populate
      localStorage.setItem('curTestamentIndex', (this.bibleService.testament).toString());
      localStorage.setItem('curBookIndex', (this.bibleService.bookSelected).toString());
      localStorage.setItem('curChap', this.bibleService.chapterNumber);
      localStorage.setItem('curVerse', this.bibleService.verseNumber);
    }
  }
}
