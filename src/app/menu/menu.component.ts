import { Component, OnInit } from '@angular/core';
import { BibleService } from '../bible.service';
import { HistoryService } from '../history.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  
  constructor(public bibleService: BibleService,
              public historyService: HistoryService,
              private router: Router, ) {

    this.bibleService.leftHandOn = localStorage.getItem('leftHanded')!;

    this.historyService.menuBooks();
   }

  ngOnInit(): void {
    
    // apply righthanded if set in storage
    let menu = document.getElementById('menu') as HTMLInputElement;
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
    let grid = document.getElementById('navGrid') as HTMLInputElement;
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
  wordSearch(){
    this.bibleService.menuHistoryBook = false;
    this.bibleService.displayMenu = false;
    this.bibleService.spinner = true;
    this.bibleService.spinnerTitle = "Restoring";
    //setTimeout needed for spinner to start
    setTimeout(() => {
      this.router.navigate(['search']); //works
    }, 10);
  }
}
