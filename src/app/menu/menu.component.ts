import { Component, OnInit } from '@angular/core';
import { BibleService } from '../bible.service';
import { HistoryService } from '../history.service';
import { Router } from '@angular/router';
import { SearchService } from '../search.service';
@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.scss'],
    standalone: false
})
export class MenuComponent implements OnInit {

  public searchDialog: any;
  public aboutDialog: any;
  public testamentDialog: any;


  constructor(public bibleService: BibleService,
              public historyService: HistoryService,
              public searchService: SearchService,
              public router: Router,
              ) {

    this.bibleService.leftHandOn = localStorage.getItem('leftHanded')!;

    this.historyService.menuBooks();
    const darkmode = matchMedia("(prefers-color-scheme: dark)");

   }

  ngOnInit(): void {

    // apply righthanded if set in storage
    let menu = document.getElementById('menu') as HTMLInputElement;
    let aboutDialog = document.getElementById('aboutDialog') as HTMLInputElement;
    if (this.bibleService.leftHandOn == 'no'|| (localStorage.getItem('leftHanded') == null)) { // or null necessary for first visit or memory wipe
      menu.setAttribute('leftHanded', 'no');
      aboutDialog.setAttribute('leftHanded', 'no');
    } else {
      menu.setAttribute('leftHanded', 'yes');
      aboutDialog.setAttribute('leftHanded', 'yes');
    }

    const toggleSwitchTheme = document.getElementById('theme') as HTMLInputElement;
    if (this.historyService.curTheme == 'dark') {
        toggleSwitchTheme.checked = true;
    }
    const toggleSwitchLeftHand =  document.getElementById('leftHand') as HTMLInputElement;
    if (this.bibleService.leftHandOn == 'yes') {
      toggleSwitchLeftHand.checked = true;
    }

  }
  ngAfterViewInit(){
    this.aboutDialog = document.getElementById("aboutDialog");
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
    let aboutDialog = document.getElementById('aboutDialog') as HTMLInputElement;

    if (leftHand.checked) {
      localStorage.setItem('leftHanded', 'yes');
      grid.setAttribute('leftHanded', 'yes');
      menu.setAttribute('leftHanded', 'yes');
      aboutDialog.setAttribute('leftHanded', 'yes');
    } else {
      menu.setAttribute('leftHanded', 'no');
      grid.setAttribute('leftHanded', 'no');
      localStorage.setItem('leftHanded', 'no');
      aboutDialog.setAttribute('leftHanded', 'no');
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
}
