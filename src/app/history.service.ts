import { Injectable } from '@angular/core';
import { BibleService } from './bible.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class HistoryService {

  public curTheme:string = "light";

  public curBookMenu?: string;
  public secBookMenu?: string;
  public thirdBookMenu?: string;

  public curChap: string = "0";
  public curSavedChap: string = "0";
  public secSavedChap: string = "0";
  public thirdSavedChap: string = "0";
  public curScrollYPostion: string = "0";
  public secScrollY: string = "0";
  public thirdScrollY: string = "0";

  public curBookArr: string = "0";
  public curTestamentArr: string = "0";
  public secBookArr: string = "0";
  public secTestamentArr: string = "0";
  public thirdBookArr: string = "0";
  public thirdTestamentArr: string = "0";

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
        this.curTestamentArr = localStorage.getItem('curTestamentIndex') ?? "0";
        this.curBookArr = localStorage.getItem('curBookIndex') ?? "0";
        this.curChap = localStorage.getItem('curChap') ?? "0";
        this.curScrollYPostion = localStorage.getItem('curScrollY') ?? "0";
        this.secTestamentArr= localStorage.getItem('secTestamentIndex') ?? "0";
        this.secBookArr = localStorage.getItem('secBookIndex') ?? "0";
        this.secSavedChap = localStorage.getItem('secSavedChap') ?? "0";
        this.secScrollY = localStorage.getItem('secScrollYSaved') ?? "0";

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
        this.curTestamentArr = localStorage.getItem('curTestamentIndex') ?? "0";
        this.curBookArr = localStorage.getItem('curBookIndex') ?? "0";
        this.curChap = localStorage.getItem('curChap') ?? "0";
        this.curScrollYPostion = localStorage.getItem('curScrollY') ?? "0";
        this.secTestamentArr= localStorage.getItem('secTestamentIndex') ?? "0";
        this.secBookArr = localStorage.getItem('secBookIndex') ?? "0";
        this.secSavedChap = localStorage.getItem('secSavedChap') ?? "0";
        this.secScrollY = localStorage.getItem('secScrollYSaved') ?? "0";

        this.bibleService.testament = Number(localStorage.getItem('thirdTestamentIndex'));
        this.bibleService.bookSelected = Number(localStorage.getItem('thirdBookIndex'));
        this.bibleService.chapterNumber = localStorage.getItem('thirdSavedChap') ?? "0";
        localStorage.setItem('curChap', localStorage.getItem('thirdSavedChap') ?? "0");
        localStorage.setItem('curScrollY', localStorage.getItem('thirdScrollYSaved') ?? "0");

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
      this.router.navigateByUrl('../testament', { skipLocationChange: true }).then(() => {
      /*
        Below works, however gives an error code 404 from static server (github pages) on 
        reload if - this.router.navigate(['/book', this.bibleService.title]);  
      */
        this.router.navigate(['../book']);  
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
    localStorage.setItem('ScrollYSaved', localStorage.getItem('curScrollY') ?? "0");
    localStorage.setItem('curSavedChap', localStorage.getItem('curChap') ?? "0");
  }

  storeBooks() {
    // only execute if not selected from history
    if (this.bibleService.menuHistoryBook == false) {

      this.curBookArr = localStorage.getItem('curBookIndex') ?? "0";
      this.curTestamentArr = localStorage.getItem('curTestamentIndex') ?? "0";
      this.secBookArr = localStorage.getItem('secBookIndex') ?? "0";
      this.secTestamentArr = localStorage.getItem('secTestamentIndex') ?? "0";
      this.curScrollYPostion = localStorage.getItem('ScrollYSaved') ?? "0";
      this.secScrollY = localStorage.getItem('secScrollYSaved') ?? "0";

      this.curSavedChap = localStorage.getItem('curSavedChap') ?? "0";
      this.secSavedChap = localStorage.getItem('secSavedChap') ?? "0";

      if (this.bibleService.bookSelected != Number(this.curBookArr) 
          || this.bibleService.testament != Number(this.curTestamentArr) ) { 
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
