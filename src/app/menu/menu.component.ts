import { Component, OnInit } from '@angular/core';
import { BibleService } from '../bible.service';
import { HistoryService } from '../history.service';
import { Router } from '@angular/router';
import { SearchService } from '../search.service';
@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  private searchSavedScroll = localStorage.getItem('currentSearch') ?? '0';
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

   }

  ngOnInit(): void {
    
    // apply righthanded if set in storage
    let menu = document.getElementById('menu') as HTMLInputElement;
    let aboutDialog = document.getElementById('aboutDialog') as HTMLInputElement;
    let searchDialog = document.getElementById('searchDialog') as HTMLInputElement;
    let testamentDialog = document.getElementById('testamentDialog') as HTMLInputElement;
    if (this.bibleService.leftHandOn == 'no'|| (localStorage.getItem('leftHanded') == null)) { // or null necessary for first visit or memory wipe
      menu.setAttribute('leftHanded', 'no');
      aboutDialog.setAttribute('leftHanded', 'no');
      searchDialog.setAttribute('leftHanded', 'no');
      testamentDialog.setAttribute('leftHanded', 'no');
    } else {
      menu.setAttribute('leftHanded', 'yes');
      aboutDialog.setAttribute('leftHanded', 'yes');
      searchDialog.setAttribute('leftHanded', 'yes');
      testamentDialog.setAttribute('leftHanded', 'yes');
    }
    // console.log(menu.getAttribute("leftHanded"));
    // console.log(aboutDialog.getAttribute("leftHanded"));

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
    this.searchDialog = document.getElementById("searchDialog");
    this.testamentDialog = document.getElementById("testamentDialog");
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
    let searchDialog = document.getElementById('searchDialog') as HTMLInputElement;
    let testamentDialog = document.getElementById('testamentDialog') as HTMLInputElement;

    if (leftHand.checked) {
      localStorage.setItem('leftHanded', 'yes');
      grid.setAttribute('leftHanded', 'yes'); 
      menu.setAttribute('leftHanded', 'yes'); 
      aboutDialog.setAttribute('leftHanded', 'yes');
      searchDialog.setAttribute('leftHanded', 'yes');
      testamentDialog.setAttribute('leftHanded', 'yes');
    } else {
      menu.setAttribute('leftHanded', 'no'); 
      grid.setAttribute('leftHanded', 'no'); 
      localStorage.setItem('leftHanded', 'no');
      aboutDialog.setAttribute('leftHanded', 'no');
      searchDialog.setAttribute('leftHanded', 'no');
      testamentDialog.setAttribute('leftHanded', 'no');
    }
  }

  backdropClose(event: any, dialog: any){
    // let rect = event.target.getBoundingClientRect();
    //only close if outside dialog box.
    // if (rect.left > event.clientX ||
    //     rect.right < event.clientX ||
    //     rect.top > event.clientY ||
    //     rect.bottom < event.clientY) {
    //     dialog.close();
    // }
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
}
