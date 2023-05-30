import { Injectable } from '@angular/core';
import { BibleService } from './bible.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class HistoryService {

  public curTheme:string = "light";

  public curBookMenu?: string; // "?" for typescript to allow undefined
  public secBookMenu?: string;
  public thirdBookMenu?: string;

  public curChap?: string;
  public curSavedChap?: string;
  public secSavedChap?: string;
  public thirdSavedChap?: string;
  public curScrollYPostion?: string;
  public secScrollY?: string;
  public thirdScrollY?: string;

  public curBookArr?: string;
  public curTestamentArr?: string;
  public secBookArr?: string;
  public secTestamentArr?: string;
  public thirdBookArr?: string;
  public thirdTestamentArr?: string;

  constructor( public bibleService: BibleService,
              public router: Router) { } 

  menuBooks() {
    this.curTheme =  localStorage.getItem('theme') ?? "light";
    let secTestInd = localStorage.getItem('secTestamentIndex');
    let thirdTestInd = localStorage.getItem('thirdTestamentIndex');

    this.curBookMenu = this.bibleService.bible[Number(localStorage.getItem('curTestamentIndex'))].books[Number(localStorage.getItem('curBookIndex'))].bookName
    + ' '  + localStorage.getItem('curChap') ;
    if (secTestInd) {
      this.secBookMenu = this.bibleService.bible[Number(secTestInd)].books[Number(localStorage.getItem('secBookIndex'))].bookName
      + ' ' + localStorage.getItem('secSavedChap') ;
    }
    if (thirdTestInd) {
      this.thirdBookMenu = this.bibleService.bible[Number(thirdTestInd)].books[Number(localStorage.getItem('thirdBookIndex'))].bookName
      + ' ' + localStorage.getItem('thirdSavedChap') ;
    }
  }

  rearrangeBooks(book:string) {

    this.bibleService.menuHistoryBook = true;
    this.bibleService.showChapters = false;
    this.bibleService.displayMenu = false;
    this.bibleService.spinner = true;
    this.bibleService.spinnerTitle = "Restoring"
    
    switch (book) {
      case 'cur':
        break;
      
      case 'sec':
        this.curTestamentArr = localStorage.getItem('curTestamentIndex')!; // "!" for typescript to allow undefined
        this.curBookArr = localStorage.getItem('curBookIndex')!;
        this.curChap = localStorage.getItem('curChap')!;
        this.curScrollYPostion = localStorage.getItem('curScrollY')!;
        this.secTestamentArr = localStorage.getItem('secTestamentIndex')!;
        this.secBookArr = localStorage.getItem('secBookIndex')!;
        this.secSavedChap = localStorage.getItem('secSavedChap')!;
        this.secScrollY = localStorage.getItem('secScrollYSaved')!;

        this.bibleService.testament = Number(this.secTestamentArr);
        this.bibleService.bookSelected = Number(this.secBookArr);
        this.bibleService.chapterNumber = this.secSavedChap;
        localStorage.setItem('curChap', this.secSavedChap);
        localStorage.setItem('curScrollY', this.secScrollY);

        localStorage.setItem('secTestamentIndex', this.curTestamentArr);
        localStorage.setItem('secBookIndex', this.curBookArr);
        localStorage.setItem('secSavedChap', this.curChap);
        localStorage.setItem('secScrollYSaved', this.curScrollYPostion);

        break;
        
      case 'third':
        this.curTestamentArr = localStorage.getItem('curTestamentIndex')!;
        this.curBookArr = localStorage.getItem('curBookIndex')!;
        this.curChap = localStorage.getItem('curChap')!;
        this.curScrollYPostion = localStorage.getItem('curScrollY')!;
        this.secTestamentArr= localStorage.getItem('secTestamentIndex')!;
        this.secBookArr = localStorage.getItem('secBookIndex')!;
        this.secSavedChap = localStorage.getItem('secSavedChap')!;
        this.secScrollY = localStorage.getItem('secScrollYSaved')!;

        this.bibleService.testament = Number(localStorage.getItem('thirdTestamentIndex'));
        this.bibleService.bookSelected = Number(localStorage.getItem('thirdBookIndex'));
        this.bibleService.chapterNumber = localStorage.getItem('thirdSavedChap')!;
        localStorage.setItem('curChap', localStorage.getItem('thirdSavedChap')!);
        localStorage.setItem('curScrollY', localStorage.getItem('thirdScrollYSaved')!);

        localStorage.setItem('secTestamentIndex', this.curTestamentArr);
        localStorage.setItem('secBookIndex', this.curBookArr);
        localStorage.setItem('secSavedChap', this.curChap);
        localStorage.setItem('secScrollYSaved', this.curScrollYPostion);

        localStorage.setItem('thirdTestamentIndex', this.secTestamentArr);
        localStorage.setItem('thirdBookIndex', this.secBookArr);
        localStorage.setItem('thirdSavedChap', this.secSavedChap);
        localStorage.setItem('thirdScrollYSaved', this.secScrollY);

        break;
    };
    this.bibleService.title = this.bibleService.bible[this.bibleService.testament].books[this.bibleService.bookSelected].bookName;
    localStorage.setItem('curTestamentIndex', (this.bibleService.testament).toString());
    localStorage.setItem('curBookIndex', (this.bibleService.bookSelected).toString());
   
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
        this.router.navigate(['./book']);  
      }); 
    }, 10); 
  }

  newBook() {
  // reset scroll position if new book selected                
    if ((this.bibleService.title != (this.bibleService.bible[Number(localStorage.getItem('curTestamentIndex'))]
                                      .books[Number(localStorage.getItem('curBookIndex'))].bookName ) 
                                    || (localStorage.getItem('curChap') == null) )
                                    && (this.bibleService.menuHistoryBook == false )) {
        localStorage.setItem('curScrollY', '0');
        localStorage.setItem('curChap', '1');  
        setTimeout(()=> this.bibleService.showChapters = true),100; //fixes problem of loading chapter-numbers.component before wasm render is finished
       // this.bibleService.showChapters = true; //Doesn't work as loads chapter-numbers.component before wasm render is finished
    } 
  }

  savePosition() {
    const bibleBookRoute = "book"; //only save current scroll if on the book route not on some other page
    if (this.router.routerState.snapshot.url.slice(1,5) == bibleBookRoute){
    localStorage.setItem('curScrollY', window.pageYOffset.toString());
    localStorage.setItem('ScrollYSaved', localStorage.getItem('curScrollY')!);
    localStorage.setItem('curSavedChap', localStorage.getItem('curChap')!);
    // console.log(this.router.routerState.snapshot.url);
    }
  }

  storeBooks() {
    // only execute if not selected from history
    if (this.bibleService.menuHistoryBook == false) {

      this.curBookArr = localStorage.getItem('curBookIndex')!;
      this.curTestamentArr = localStorage.getItem('curTestamentIndex')!;
      this.secBookArr = localStorage.getItem('secBookIndex')!;
      this.secTestamentArr = localStorage.getItem('secTestamentIndex')!;
      this.curScrollYPostion = localStorage.getItem('ScrollYSaved')!;
      this.secScrollY = localStorage.getItem('secScrollYSaved')!;

      this.curSavedChap = localStorage.getItem('curSavedChap')!;
      this.secSavedChap = localStorage.getItem('secSavedChap')!;

      if (this.bibleService.bookSelected != Number(this.curBookArr) 
          || this.bibleService.testament != Number(this.curTestamentArr) ) { 
            // console.log(this.bibleService.bookSelected);
        if (this.secTestamentArr != null) {
          localStorage.setItem('thirdTestamentIndex', this.secTestamentArr);
          localStorage.setItem('thirdBookIndex', this.secBookArr);
          localStorage.setItem('thirdScrollYSaved', this.secScrollY);
          localStorage.setItem('thirdSavedChap', this.secSavedChap);
        }
        localStorage.setItem('secTestamentIndex', this.curTestamentArr);
        localStorage.setItem('secBookIndex', this.curBookArr);
        localStorage.setItem('secScrollYSaved', this.curScrollYPostion);
        localStorage.setItem('secSavedChap', this.curSavedChap);
      }
      // The following need to be here or history won't originally populate
      localStorage.setItem('curTestamentIndex', (this.bibleService.testament).toString());
      localStorage.setItem('curBookIndex', (this.bibleService.bookSelected).toString());
    }
  }
}
