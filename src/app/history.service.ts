import { Injectable } from '@angular/core';
import { BibleService } from './bible.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class HistoryService {

  public curTheme:string = "light";

  public storedRecent: any = [];
  public storedBookmarks: any =[];
  public verseClicked: any;

  constructor( public bibleService: BibleService,
              public router: Router) {
  }

  rearrange(index: any){
    this.bibleService.menuHistoryBook = true;
    this.bibleService.showChapters = false;
    this.bibleService.displayMenu = false;
    this.bibleService.spinner = true;
    this.bibleService.spinnerTitle = "Restoring"

    let selected = this.storedRecent[index];
    let lengthArray = this.storedRecent.length;
    this.storedRecent.splice(index, 1);
    // console.log(this.storedRecent, lengthArray, index)
    this.storedRecent.unshift(selected);
    localStorage.setItem('recent', JSON.stringify(this.storedRecent));
    this.bibleService.testament = this.storedRecent[0][0];
    this.bibleService.bookSelected = this.storedRecent[0][1];
    this.bibleService.chapterNumber = this.storedRecent[0][2];
    this.bibleService.verseNumber = this.storedRecent[0][3];
    this.bibleService.title = this.bibleService.bible[this.bibleService.testament].books[this.bibleService.bookSelected].bookName;

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
  openBookmark(index: any){
    this.bibleService.menuHistoryBook = true;
    this.bibleService.isBookmark = true;
    this.bibleService.showChapters = false;
    this.bibleService.displayMenu = false;
    this.bibleService.spinner = true;
    this.bibleService.spinnerTitle = "Restoring"

    this.storedBookmarks = JSON.parse(localStorage.getItem('bookmarks')!);
    this.bibleService.testament = this.storedBookmarks[index][0];
    this.bibleService.bookSelected = this.storedBookmarks[index][1];
    this.bibleService.chapterNumber = this.storedBookmarks[index][2];
    this.bibleService.verseNumber = this.storedBookmarks[index][3];
    this.bibleService.title = this.bibleService.bible[this.bibleService.testament].books[this.bibleService.bookSelected].bookName;

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
  storeRecent(){
    if (this.bibleService.menuHistoryBook == false) {
      let recentStore = JSON.parse(localStorage.getItem('recent')!);
      let recentOne = [this.bibleService.testament, this.bibleService.bookSelected, this.bibleService.chapterNumber, this.bibleService.verseNumber];
      let x = JSON.stringify([recentOne]);//this and above; only for no Recent in storage; double brackets for first one
      if (recentStore) {
        if (this.bibleService.menuHistoryBook == false && (this.bibleService.bookSelected != recentStore[0][1])
          || (this.bibleService.testament != recentStore[0][0])) {
          this.storedRecent.unshift(recentOne);
          let lengthArray = this.storedRecent.length;
          if (lengthArray < 8) {
            localStorage.setItem('recent', JSON.stringify(this.storedRecent));
          } else {
            this.storedRecent.splice(8, 8);
            localStorage.setItem('recent', JSON.stringify(this.storedRecent));
          }
        }
      } else {
        // The following need to be here or it won't originally populate
        localStorage.setItem('recent', x);
      }
    }
  }
  storeBookmark(){
    this.storedBookmarks = JSON.parse(localStorage.getItem('bookmarks')!);
    if (this.storedBookmarks) {
        this.storedBookmarks.unshift(JSON.parse(this.verseClicked));
        let lengthArray = this.storedBookmarks.length;
        if (lengthArray < 12) {
          localStorage.setItem('bookmarks', JSON.stringify(this.storedBookmarks));
        } else {
          this.storedBookmarks.splice(12, 1);
          localStorage.setItem('bookmarks', JSON.stringify(this.storedBookmarks));
        }
      // }
    } else {
      // The following need to be here or it won't originally populate
      let x = JSON.parse(this.verseClicked);
      localStorage.setItem('bookmarks', JSON.stringify([x])); //add extra [] for first entry
    }
  }
}
