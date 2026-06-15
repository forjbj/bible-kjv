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
  public fourthBookMenu?: string | null;
  public fifthBookMenu?: string | null;
  public sixthBookMenu?: string | null;
  public seventhBookMenu?: string | null;

  constructor( public bibleService: BibleService,
              public router: Router) { }

  menuBooks() {
    this.curTheme =  localStorage.getItem('theme') ?? "light";

    let cur = JSON.parse(localStorage.getItem('recent1')!);
    let sec = JSON.parse(localStorage.getItem('recent2')!);
    let third = JSON.parse(localStorage.getItem('recent3')!);
    let fourth = JSON.parse(localStorage.getItem('recent4')!);
    let fifth = JSON.parse(localStorage.getItem('recent5')!);
    let sixth = JSON.parse(localStorage.getItem('recent6')!);
    let seventh = JSON.parse(localStorage.getItem('recent7')!);

    if (this.bibleService.chapterNumber != 0) {
      this.curBookMenu = this.bibleService.bible[this.bibleService.testament].books[this.bibleService.bookSelected].bookName
      + ' '  + this.bibleService.chapterNumber ;
    } else {
      this.curBookMenu = this.bibleService.bible[this.bibleService.testament].books[this.bibleService.bookSelected].bookName;
    }
    if (sec) { // NO idea why javascript does this; could be either depending on how you hold your tongue
      if (sec[2] != 0){
        this.secBookMenu = this.bibleService.bible[sec[0]].books[sec[1]].bookName
        + ' ' + sec[2];
      } else {
        this.secBookMenu = this.bibleService.bible[sec[0]].books[sec[1]].bookName;
      }
    }
    if (third) { // NO idea why javascript does this; could be either depending on how you hold your tongue
      if (third[2] != 0){
        this.thirdBookMenu = this.bibleService.bible[third[0]].books[third[1]].bookName
        + ' ' + third[2];
      } else {
        this.thirdBookMenu = this.bibleService.bible[third[0]].books[third[1]].bookName;
      }
    }
    if (fourth) { // NO idea why javascript does this; could be either depending on how you hold your tongue
      if (fourth[2] != 0){
        this.fourthBookMenu = this.bibleService.bible[fourth[0]].books[fourth[1]].bookName
        + ' ' + fourth[2];
      } else {
        this.fourthBookMenu = this.bibleService.bible[fourth[0]].books[fourth[1]].bookName;
      }
    }
    if (fifth) { // NO idea why javascript does this; could be either depending on how you hold your tongue
      if (fifth[2] != 0){
        this.fifthBookMenu = this.bibleService.bible[fifth[0]].books[fifth[1]].bookName
        + ' ' + fifth[2];
      } else {
        this.fifthBookMenu = this.bibleService.bible[fifth[0]].books[fifth[1]].bookName;
      }
    }
    if (sixth) { // NO idea why javascript does this; could be either depending on how you hold your tongue
      if (sixth[2] != 0){
        this.sixthBookMenu = this.bibleService.bible[sixth[0]].books[sixth[1]].bookName
        + ' ' + sixth[2];
      } else {
        this.sixthBookMenu = this.bibleService.bible[sixth[0]].books[sixth[1]].bookName;
      }
    }
    if (seventh) { // NO idea why javascript does this; could be either depending on how you hold your tongue
      if (seventh[2] != 0){
        this.seventhBookMenu = this.bibleService.bible[seventh[0]].books[seventh[1]].bookName
        + ' ' + seventh[2];
      } else {
        this.seventhBookMenu = this.bibleService.bible[seventh[0]].books[seventh[1]].bookName;
      }
    }
  }
  rearrangeBooks(book:string) {

    let cur_ = JSON.parse(localStorage.getItem('recent1')!);
    let sec_ = JSON.parse(localStorage.getItem('recent2')!);
    let third_ = JSON.parse(localStorage.getItem('recent3')!);
    let fourth_ = JSON.parse(localStorage.getItem('recent4')!);
    let fifth_ = JSON.parse(localStorage.getItem('recent5')!);
    let sixth_ = JSON.parse(localStorage.getItem('recent6')!);
    let seventh_ = JSON.parse(localStorage.getItem('recent7')!);

    this.bibleService.menuHistoryBook = true;
    this.bibleService.showChapters = false;
    this.bibleService.displayMenu = false;
    this.bibleService.spinner = true;
    this.bibleService.spinnerTitle = "Restoring"

    switch (book) {
      case 'cur':
        break;
      case 'sec':
        this.bibleService.testament = sec_[0];
        this.bibleService.bookSelected = sec_[1];
        this.bibleService.chapterNumber = sec_[2];
        this.bibleService.verseNumber = sec_[3];
        localStorage.setItem('recent1', JSON.stringify(sec_));
        localStorage.setItem('recent2', JSON.stringify(cur_));

        break;
      case 'third':
        this.bibleService.testament = third_[0];
        this.bibleService.bookSelected = third_[1];
        this.bibleService.chapterNumber = third_[2]!;
        this.bibleService.verseNumber = third_[3]!;
        localStorage.setItem('recent1', JSON.stringify(third_));
        localStorage.setItem('recent2', JSON.stringify(cur_));
        localStorage.setItem('recent3', JSON.stringify(sec_));

        break;
      case 'fourth':
        this.bibleService.testament = fourth_[0];
        this.bibleService.bookSelected = fourth_[1];
        this.bibleService.chapterNumber = fourth_[2]!;
        this.bibleService.verseNumber = fourth_[3]!;
        localStorage.setItem('recent1', JSON.stringify(fourth_));
        localStorage.setItem('recent2', JSON.stringify(cur_));
        localStorage.setItem('recent3', JSON.stringify(sec_));
        localStorage.setItem('recent4', JSON.stringify(third_));

        break;
      case 'fifth':
        this.bibleService.testament = fifth_[0];
        this.bibleService.bookSelected = fifth_[1];
        this.bibleService.chapterNumber = fifth_[2]!;
        this.bibleService.verseNumber = fifth_[3]!;
        localStorage.setItem('recent1', JSON.stringify(fifth_));
        localStorage.setItem('recent2', JSON.stringify(cur_));
        localStorage.setItem('recent3', JSON.stringify(sec_));
        localStorage.setItem('recent4', JSON.stringify(third_));
        localStorage.setItem('recent5', JSON.stringify(fourth_));

        break;
      case 'sixth':
        this.bibleService.testament = sixth_[0];
        this.bibleService.bookSelected = sixth_[1];
        this.bibleService.chapterNumber = sixth_[2]!;
        this.bibleService.verseNumber = sixth_[3]!;
        localStorage.setItem('recent1', JSON.stringify(sixth_));
        localStorage.setItem('recent2', JSON.stringify(cur_));
        localStorage.setItem('recent3', JSON.stringify(sec_));
        localStorage.setItem('recent4', JSON.stringify(third_));
        localStorage.setItem('recent5', JSON.stringify(fourth_));
        localStorage.setItem('recent6', JSON.stringify(fifth_));

        break;
      case 'seventh':
        this.bibleService.testament = seventh_[0];
        this.bibleService.bookSelected = seventh_[1];
        this.bibleService.chapterNumber = seventh_[2]!;
        this.bibleService.verseNumber = seventh_[3]!;
        localStorage.setItem('recent1', JSON.stringify(seventh_));
        localStorage.setItem('recent2', JSON.stringify(cur_));
        localStorage.setItem('recent3', JSON.stringify(sec_));
        localStorage.setItem('recent4', JSON.stringify(third_));
        localStorage.setItem('recent5', JSON.stringify(fourth_));
        localStorage.setItem('recent6', JSON.stringify(fifth_));
        localStorage.setItem('recent7', JSON.stringify(sixth_));

        break;
    };
    this.bibleService.title = this.bibleService.bible[this.bibleService.testament].books[this.bibleService.bookSelected].bookName;

    // localStorage.setItem('recent1', JSON.stringify(cur_));

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
      let recentOne = JSON.parse(localStorage.getItem('recent1')!);
      let recentTwo = JSON.parse(localStorage.getItem('recent2')!);
      let recentThree = JSON.parse(localStorage.getItem('recent3')!);
      let recentFour = JSON.parse(localStorage.getItem('recent4')!);
      let recentFive = JSON.parse(localStorage.getItem('recent5')!);
      let recentSix = JSON.parse(localStorage.getItem('recent6')!);
      let recentSeven = JSON.parse(localStorage.getItem('recent7')!);

       if (recentOne) {
         if ((this.bibleService.bookSelected != recentOne[1])
           || (this.bibleService.testament != recentOne[0])) {
           let one = JSON.stringify(recentOne);
           localStorage.setItem('recent2', one);
           if (recentTwo) {
             let two = JSON.stringify(recentTwo);
             localStorage.setItem('recent3', two);
             if (recentThree) {
               let three = JSON.stringify(recentThree);
               localStorage.setItem('recent4', three);
               if (recentFour) {
                 let four = JSON.stringify(recentFour);
                 localStorage.setItem('recent5', four);
                 if (recentFive) {
                   let five = JSON.stringify(recentFive);
                   localStorage.setItem('recent6', five);
                   if (recentSix) {
                     let six = JSON.stringify(recentSix);
                     localStorage.setItem('recent7', six);
                   }
                 }
               }
             }
           }
         }
       }
      // The following need to be here or history won't originally populate
      recentOne = [this.bibleService.testament, this.bibleService.bookSelected, this.bibleService.chapterNumber, this.bibleService.verseNumber];
      let x = JSON.stringify(recentOne);
      localStorage.setItem('recent1', x);

    }
  }
}
