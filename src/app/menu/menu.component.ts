import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { BibleService } from '../bible.service';
import { HistoryService } from '../history.service';
import { Router } from '@angular/router';
import { SearchService } from '../search.service';

@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class MenuComponent implements OnInit {

  public searchDialog: any;
  public aboutDialog: any;
  public testamentDialog: any;
  public randomDialog: any;

  public recentShowHide: any;
  public settingsShowHide: any;
  public bookmarkShowHide: any;

  public clickedRandom = false; //necessary for Random Scripture dialog not to load on menu open
  // public clickedRecent = false; //necessary for Recent not to load on menu open

  // public storedBookmarks = localStorage.getItem('bookmarks')!;

  constructor(public bibleService: BibleService,
              public historyService: HistoryService,
              public searchService: SearchService,
              public router: Router,
              ) {

    this.bibleService.leftHandOn = localStorage.getItem('leftHanded')!;

    // this.historyService.menuBooks();
    const darkmode = matchMedia("(prefers-color-scheme: dark)");

    this.historyService.storedRecent = JSON.parse(localStorage.getItem('recent')!) //necessary or Recently Opened doesn't initally populate
    this.historyService.storedBookmarks = JSON.parse(localStorage.getItem('bookmarks')!);
   }

  ngOnInit(): void {

    // apply righthanded if set in storage
    let menu = document.getElementById('menu') as HTMLInputElement;
    let aboutDialog = document.getElementById('aboutDialog') as HTMLInputElement;
    if (this.bibleService.leftHandOn == 'no'|| (localStorage.getItem('leftHanded') == null)) { // or null necessary for first visit or memory wipe
      menu.setAttribute('leftHanded', 'no');
    } else {
      menu.setAttribute('leftHanded', 'yes');
    }

    const toggleSwitchTheme = document.getElementById('theme') as HTMLInputElement;
    if (this.historyService.curTheme == 'dark') {
        toggleSwitchTheme.checked = true;
    }
    const toggleSwitchLeftHand =  document.getElementById('leftHand') as HTMLInputElement;
    if (this.bibleService.leftHandOn == 'yes') {
      toggleSwitchLeftHand.checked = true;
    }

    // localStorage.setItem('recent', "[[0,1,1,1], [1,2,3,5]]")
  }
  ngAfterViewInit(){
    this.aboutDialog = document.getElementById("aboutDialog"); // needed for 'showModal' to work
    this.randomDialog = document.getElementById("randomDialog");// needed for 'showModal' to work

    this.settingsShowHide = document.getElementById('settings');
    this.recentShowHide = document.getElementById('recentLinks');
    this.bookmarkShowHide = document.getElementById('bookmarkLinks');

    // console.log(this.historyService.storedRecent)
 }

/* Change theme */
  themeChange(){
      let theme = document.getElementById('theme') as HTMLInputElement;
      if (theme.checked) {
        document.documentElement.setAttribute('dataTheme', 'dark');
        localStorage.setItem('theme', 'dark');
    }
    else {
        document.documentElement.setAttribute('dataTheme', 'light');
        localStorage.setItem('theme', 'light');
    }
  };
/* Change sides */
  leftHand(){
    let leftHand = document.getElementById('leftHand') as HTMLInputElement;
    let grid = document.getElementById('nav') as HTMLInputElement;
    let menu = document.getElementById('menu') as HTMLInputElement;

    if (leftHand.checked) {
      localStorage.setItem('leftHanded', 'yes');
      grid.setAttribute('leftHanded', 'yes');
      menu.setAttribute('leftHanded', 'yes');
    } else {
      menu.setAttribute('leftHanded', 'no');
      grid.setAttribute('leftHanded', 'no');
      localStorage.setItem('leftHanded', 'no');
    }
  }
  backdropClose(event: any, dialog: any){
    if (event.target === dialog) {
      dialog.close();
    }
  }
  // Below is necessary as ternary doesn't work for reasons that are beyond me
  showPreviousSearch(){
    this.bibleService.displayMenu = false;
    this.router.navigate(['search']);
    //setTimeouts are necessary to force javascript to run thing in order
    setTimeout(() =>{
      this.searchService.resultsSet();
    },100)
  }
  showSearch(){
    this.bibleService.displayMenu = false;
    this.router.navigate(['search']);
  }
  toggleList(listCurrent: any, elementCurrent: any, listSecond: any, elementSecond: any, listThird: any, elementThird: any, ){
    let idCurrent = document.getElementById(elementCurrent)!;
    let idSecond = document.getElementById(elementSecond)!;
    let idThird = document.getElementById(elementThird)!;
    if (listCurrent.style.display === "none") {
      listCurrent.style.display = "block"; // Show the list
      // listCurrent.style.opacity = "1";
      idCurrent.style.color = "var(--lightRed)";
      listSecond.style.display = "none";
      idSecond.style.color = "var(--ink)";
      listThird.style.display = "none";
      idThird.style.color = "var(--ink)";

    } else {
        listCurrent.style.display = "none"; // Hide the list
        idCurrent.style.color = "var(--ink)";
    }
  }

}
