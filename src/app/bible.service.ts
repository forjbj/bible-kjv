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

  // Below must be ternary or Number(localStorage...) defaults to 0
  public testament:number = localStorage.getItem('curTestamentIndex') ? (Number(localStorage.getItem('curTestamentIndex'))) : 1; // defaults to '1' (new testament) if undefined or null
  public bookSelected:number = localStorage.getItem('curBookIndex') ? (Number(localStorage.getItem('curBookIndex'))) : 3; // defaults to '3' (Gospel of John) see above
  public chapterNumber: any = localStorage.getItem('curChap') ? localStorage.getItem('curChap') : '0';
  public verseNumber: any = localStorage.getItem('curVerse') ? localStorage.getItem('curVerse') : '0';

  public fragment():string {
    return this.testament + '-' + this.bookSelected + '-' + this.chapterNumber + '-' + this.verseNumber; // '-' at the front of the id is necessary as angular's anchor scrolling get confused otherwise
  }

  public testamentShow:number = 1; //defaults to new testment; for dialog to testaments component, new testament has autofocus

  public title: string = this.bible[this.testament].books[this.bookSelected].bookName;

  public showChapters: boolean = false; /*for chapter highlighting MUST BE toggled
                                (scroll through chapters doesn't work otherwise);
                                set to 'true' in historyService.newBook() selection, but doesn't highligh to chapter 1;
                                not working properly TODO;
                                */

  public displayMenu: boolean = false;
  public menuHistoryBook: boolean = false;

  public searchResults: any = "noSearchYet";
  public searchRequest?: string ;

  //variable for lefthand menu position
  public leftHandOn?: string; // "?" for typescript to allow undefined

  //variable for chapter button display
  public chapterButton: boolean;

  //variable for spinner animation
  public spinner: boolean = false;
  public spinnerTitle: string;

  public searchRan = false;//needed for search saved position

  // public overlayRef!: OverlayRef;

    constructor(
      public router: Router,
      // public overlay: Overlay,
      ) {

      this.pageTitle ??= "Bible";
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
