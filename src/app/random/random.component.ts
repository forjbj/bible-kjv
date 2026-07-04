import { Component, OnInit, ChangeDetectionStrategy, ElementRef, Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { BibleService } from '../bible.service';
import * as bibleJson from '../../assets/bible/Bible.json';
import * as wasm from '../../../pkg';
import { MenuComponent } from '../menu/menu.component';
import * as dictionaryJson from '../../assets/bible/Dictionary.json';

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

  constructor(public title: Title,
    public meta: Meta,
    public elementRef: ElementRef,
    public menu: MenuComponent,
  ) {
  }

  ngAfterViewInit() {
    this.load();
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
    this.wordsDefineRandom();
    setTimeout(() => {
      this.scrollToVer();
    }, 100);
  }
  scrollToVer() {
    // const ver = document?.getElementsByClassName("ver")
    const ver = document.getElementById(this.verse.toString())!;
    // ver[this.verse -1].scrollIntoView({
    // console.log(this.verse);
    ver.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'center'
    });
  }
  backdropClose(event: any) {
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

  wordsDefineRandom() {
    let chap = this.chapter;
    // below is needed for new book selection
    if (chap == 0) {
      chap = 1;
    }
    for (var j = 0; j < 2; j++) {
      const chapterSection = document.getElementById(this.testament + "-" + this.bookSelected + "-" + (this.chapter!-1));
      // console.log(this.testament + "-" + this.bookSelected + "-" + this.chapter)
      // skip if already definitions already populated
      // if (chapterSection!.querySelector("wordToDefine")) {
      //   continue
      // };
      const scripture = chapterSection!.querySelectorAll(".firstVerse, .scripture");
      const dictionary: any = dictionaryJson;
      for (let i = 0; i < scripture.length; i++) {
        let verse = (scripture[i] as HTMLElement).innerHTML;
        for (const key in dictionary[0]) {
          let re = new RegExp("(<span.*?<\/span>)|(\\b" + key + "\\b)", 'gi');
          let alreadyDefined = false;
          function replacer(match: any, p1: any, p2: any) {
            if (p2 == undefined) return p1;
            // else return "<span class='definitionParent' definition='" + dictionary[0][key] + "' tabindex=0>" + p2 + "</span>";
            // tabindex="0" essential for below to obtain focus
            else {
              if (alreadyDefined == true) {
                //This is necessary or replacer just keep putting the definition into each of the same words in the sentence.
                return p2;
              }
              else {
                alreadyDefined = true;
                return "<span class=\"wordToDefine\" tabindex=0>" + p2 + "<dl class='definition'><dt>" + p2 + ":</dt><dd>" + dictionary[0][key] + "</dd></dl></span>";
              }
            };
          };
          verse = verse.replace(re, replacer);
          //  // below works, sort of, doubles up on definitions; i.e. definitions of words in defintions - needs fixing
          //   // (?<!<\/?) Negative lookbehind: ensures the match is not preceded by < or </.
          //   // (?!>) Negative lookahead: ensures it is not followed by > (so not <span>).
          //   let re = new RegExp("(?:<span\b[^>]*>[\s\S]*?<\/span>)?((?<!<\/?)\\b" + key + "\\b(?!>))", 'i');
          //  verse = verse.replace(re, "<span class=\"wordToDefine\" tabindex=0>" + " $1 " + "<dl class='definition'><dt>" + "$1" + ":</dt><dd>" + dictionary[0][key] + "</dd></dl></span>");
        };
        scripture[i].innerHTML = verse;
      };
      // if (document.getElementById(this.testament + "-" + this.bookSelected + "-" + (Number(chap) + 1).toString() + "-" + "0-S")) {
      //   chap = (chap! + 1);
      // } else {
      //   break;
      // }
    }
  }
}
export function read_file() { // MUST be in here as lib.rs points here
  return JSON.stringify(bibleJson); // WASM WORKS! don't touch
}
