import { Component, OnInit, ChangeDetectionStrategy, ElementRef } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { BibleService } from '../bible.service';
import * as bibleJson from '../../assets/bible/Bible.json';
import * as wasm from '../../../pkg';
import { MenuComponent } from '../menu/menu.component';

@Component({
  selector: 'app-random',
  templateUrl: './random.component.html',
  styleUrl: './random.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false

})
export class RandomComponent {
  public result?: string = ""; //empty string necessary or 'undefined' shows up briefly on screen
  public chapter?: number;
  public verse: number = 1;
  public observer?: IntersectionObserver;
  public bookSelected?: number;
  public testament?: number;
  public bookName?: any;

  public bible: any = bibleJson;

  constructor( public title: Title,
             public meta: Meta,
             public elementRef:ElementRef,
             public menu: MenuComponent,
  ) {
    this.load();
  }

  ngAfterViewInit(){

  }
  load() {
    this.threadWASM();
    setTimeout(() => { //setTimeOut 0.4secs; necessary as bibleInfo not populated on start ??? not sure why; reload produces last book info without this
      this.bibleInfo();
    }, 300);
  }
  threadWASM() {
    if (typeof Worker !== 'undefined') {
      // Create a new
      const worker = new Worker(new URL('./random.worker', import.meta.url));
      worker.onmessage = ({ data }) => {
        this.result = data;
      };
      worker.postMessage(wasm.render_widget());
    } else {
      // Web workers are not supported in this environment.
      // You should add a fallback so that your program still executes correctly.
      this.result = wasm.render_widget();
    }
  }

  bibleInfo() {
    if (this.elementRef?.nativeElement.querySelector(".head")) { //necessary or error for null values below on inital load
      const name: any = this.elementRef?.nativeElement.querySelector(".head");
      const splits = name.id.toString().split('-');
      const ver = document?.getElementsByClassName("ver")
      this.verse = Math.floor(Math.random() * ver.length) + 1;
      this.testament = Number(splits[0]);
      this.bookSelected = Number(splits[1]);
      this.chapter = Number(splits[2]) + 1; // add 1 to get right chapter number
      this.bookName = this.bible[this.testament].books[this.bookSelected].bookName;
    }
    setTimeout(() => {
      this.scrollToVer();
    },100);
  }
  scrollToVer(){
    // const ver = document?.getElementsByClassName("ver")
    const ver = document.getElementById(this.verse.toString())!;
    // ver[this.verse -1].scrollIntoView({
    ver.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'center'
    });
  }
  backdropClose(event: any){
    let rect = event.target.getBoundingClientRect();
    //only close if outside dialog box.
    if (rect.left > event.clientX ||
        rect.right < event.clientX ||
        rect.top > event.clientY ||
        rect.bottom < event.clientY
    ) {
        this.menu.randomDialog.close();
    }
  }
}
export function read_file() { // MUST be in here as lib.rs points here
  return JSON.stringify(bibleJson); // WASM WORKS! don't touch
}
