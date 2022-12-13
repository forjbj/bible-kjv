import { Component, ElementRef, OnInit } from '@angular/core';
import * as bibleJson from '../../assets/bible/Bible.json';
import * as wasm from '../../../pkg';
import { Meta, Title } from '@angular/platform-browser';
import { BibleService } from '../bible.service';

@Component({
  selector: 'app-widget',
  templateUrl: './widget.component.html',
  styleUrls: ['./widget.component.scss']
})
export class WidgetComponent implements OnInit {
  //appTitle = 'widget';
  public result?: string;
  public chapter?: number;
  public verse?: number;
  public observer?: IntersectionObserver;
  public bookSelected?: number;
  public testament?: number;
  public bookName: any;
  
constructor( public title: Title,
             public meta: Meta,
             public elementRef:ElementRef,
             public bibleService: BibleService,) {
  this.result = wasm.render_widget();
  this.title.setTitle('Bible Widget');
  this.meta.addTag({ name: 'description', content: 'Widget; for future use, when enabled in PWA\'s'});

}
ngOnInit(){ }

ngAfterViewInit(): void {
  const name = this.elementRef.nativeElement.querySelector(".head");
  const splits = name.id.toString().split('-');
  this.testament = Number(splits[0]);
  this.bookSelected = Number(splits[1]);
  this.chapter = Number(splits[2]) + 1; // add 1 to get right chapter number
  this.bookName = this.bibleService.bible[this.testament].books[this.bookSelected].bookName;
  const ver = name.getElementsByTagName("DIV");
  this.verse = Math.floor(Math.random() * ver.length) + 1;

  ver[this.verse -1].scrollIntoView({
                        behavior: 'auto',
                        block: 'center',
                        inline: 'center'
                    });
}
reload() {
document.location.reload();
}
}
export function read_file() {
return JSON.stringify(bibleJson); // WASM WORKS! don't touch
}


