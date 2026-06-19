import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { BibleService } from '../bible.service';
import { MenuComponent } from '../menu/menu.component';

@Component({
    selector: 'app-about',
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AboutComponent implements OnInit {

  constructor(public bibleService: BibleService,
              public title: Title,
              public meta: Meta,
              public menu: MenuComponent,) {
    this.meta.addTag({ name: 'description', content: 'About this Application; including version history and repository location' });
  }
  ngOnInit(): void {
  }

}
