import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import * as bibleJson from '../assets/bible/Bible.json';
import {filter, map} from 'rxjs/operators';
import { BibleService } from './bible.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Bible';

  updateAvailable = false;

  constructor(private swUpdate: SwUpdate,
              public router: Router,
              public bibleService: BibleService) {

    // apply dark theme if set in storage
    if (localStorage.getItem('theme') == 'dark') {
      document.documentElement.setAttribute('dataTheme', 'dark');
    }
    // this is the code needed for angular 13 and onwards; check for updates to the site -WORKS!!
    const updatesAvailable = swUpdate.versionUpdates.pipe(
      filter((evt): evt is VersionReadyEvent => evt.type === 'VERSION_READY'),
      map(evt => ({
        type: 'UPDATE_AVAILABLE',
        current: evt.currentVersion,
        available: evt.latestVersion,
      })));
    updatesAvailable.subscribe((event) => {
        this.updateAvailable = true;
        console.log("update Available");
    });
  }
}
export function read_file() {
  return JSON.stringify(bibleJson); // WASM WORKS! don't touch
}
