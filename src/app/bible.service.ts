import { Injectable } from '@angular/core';
import Bible from '../assets/bible/Bible.json';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class BibleService {

  // import Bible
  public bible: any = Bible;

  public pageTitle:string;

  public testament:number = Number(localStorage.getItem('curTestamentIndex')) ?? 0; // defaults to '0' (old testament) if '' or null
  public bookSelected:number = Number(localStorage.getItem('curBookIndex')) ?? 0; // defaults to '0' (Genesis) see above
  public chapterNumber: string = localStorage.getItem('curChap') ?? '1';
  public verseNumber: string = localStorage.getItem('curVerse') ?? '';

  public fragment():string { 
    return this.testament + '-' + this.bookSelected + '-' + this.chapterNumber + '-' + this.verseNumber; // '-' at the front of the id is necessary as angular's anchor scrolling get confused otherwise
  }


  public title: string = this.bible[this.testament].books[this.bookSelected].bookName;

  public showChapters: boolean = false; /*for chapter highlighting MUST BE toggled 
                                (scroll through chapters doesn't work otherwise); 
                                set to 'true' in historyService.newBook() selection, but doesn't highligh to chapter 1; 
                                not working properly TODO;
                                */ 

  public displayMenu: boolean = false;
  public menuHistoryBook: boolean = false;

  public searchResults: any = "<br><h2>Search results will appear here...</h2>";
  public searchRequest?: string ;

  //variable for lefthand menu position
  public leftHandOn?: string; // "?" for typescript to allow undefined

  //variable for chapter button display
  public chapterButton: boolean;

  //variable for spinner animation
  public spinner: boolean = false;
  public spinnerTitle: string;

  public searchRan = false;//needed for search saved position
 
    constructor(
      public router: Router,
    ) {
      this.pageTitle ??= "Bible";
      this.title ??= "Bible";
      this.chapterButton ??= true; // turn on if null or memory wipe
      this.spinnerTitle ??= "Rendering";
    }

    //wordSearch needs to be in this service or throws an error re: "changed after it was checked"
    wordSearch(){
      if (this.router.url != '/search') { //Necessary or confuses angular router
        this.showChapters = false;
        this.menuHistoryBook = false;
        this.displayMenu = false;
        if (this.searchRan == true){
          this.spinner = true;
          this.spinnerTitle = "Restoring";
        }
        //setTimeout needed for spinner to start
        setTimeout(() => {
          this.router.navigate(['search']); //Do Not use fragment as it confuses angular router if user selects 'Word Search' from menu while already at that route
        }, 10);
      }
    }
  
}