import { AfterViewInit, Component, OnInit } from '@angular/core';
import { BibleService } from '../bible.service';
import { HistoryService } from '../history.service';
import { Meta, Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { trigger, state, style, animate, transition, query, group } from '@angular/animations';


@Component({
  selector: 'app-the-bible',
  templateUrl: './the-bible.component.html',
  styleUrls: ['./the-bible.component.scss'],
  animations: [
    trigger('inOutAnimate', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms'),
      ]),
      transition(':leave', [
        animate('300ms', style({ opacity: 0 }))
      ]),

      // transition(':enter', [
      //   style({  transform: 'translateY(300px)' }),
      //   animate('300ms', style({  transform: 'translateY(*)'  })),
      // ]),
      // transition(':leave', [
      //   animate('300ms', style({ transform: 'translateY(300px)' }))
      // ]),
    ])
  ]
})

export class TheBibleComponent implements OnInit, AfterViewInit {

  constructor(public bibleService: BibleService,
              public historyService: HistoryService,
              public meta: Meta,
              public title: Title,
              private router: Router,) {
    
    title.setTitle('Bible - King James Version - PWA');
    this.meta.addTag({ name: 'description', content: 'Bible application with History and Search functionality.'});

  } 

  ngOnInit() {
    // apply righthanded if set in storage
    let grid = document.getElementById('nav') as HTMLInputElement;
    let routerOut = document.getElementById('routerOutlet') as HTMLInputElement;
    // console.log(grid)
    if (localStorage.getItem('leftHanded') == 'no'|| (localStorage.getItem('leftHanded') == null)) {
      grid.setAttribute('leftHanded', 'no');
      routerOut?.setAttribute('leftHanded', 'no');
    } else {
      grid.setAttribute('leftHanded', 'yes');
      routerOut?.setAttribute('leftHanded', 'yes');
    }
  }
  
  ngAfterViewInit() {
  }
  restoreBook () {
    this.bibleService.spinner = true;
    this.bibleService.spinnerTitle = "Restoring";
    this.bibleService.displayMenu = false;
    this.bibleService.showChapters = false;
    //setTimeout needed for spinner to start
    setTimeout(() => {
      this.router.navigate(['./book'], {fragment: this.bibleService.fragment()}); //works
    }, 10);
  }
}
