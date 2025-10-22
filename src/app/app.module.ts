import { BrowserModule } from '@angular/platform-browser';
import { NgModule, isDevMode, provideZoneChangeDetection } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

import { TestamentsComponent } from './testaments/testaments.component';
import { DisplayBookComponent } from './display-book/display-book.component';
import { TheBibleComponent } from './the-bible/the-bible.component';
import { UpdateToasterComponent } from './update-toaster/update-toaster.component';
import { MenuComponent } from './menu/menu.component';
import { ChapterNumbersComponent } from './chapter-numbers/chapter-numbers.component';
import { SafePipe } from './safe.pipe';
import { SearchComponent } from './search/search.component';
import { FormsModule } from '@angular/forms';
import { AboutComponent } from './about/about.component';
import { WidgetComponent } from './widget/widget.component';
import { NotFoundComponent } from './not-found/not-found.component';

@NgModule({
  declarations: [
    AppComponent,
    TestamentsComponent,
    DisplayBookComponent,
    TheBibleComponent,
    UpdateToasterComponent,
    MenuComponent,
    ChapterNumbersComponent,
    SafePipe,
    SearchComponent,
    AboutComponent,
    WidgetComponent,
    NotFoundComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    FormsModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
  ],
  providers: [provideZoneChangeDetection()],
  bootstrap: [AppComponent]
})
export class AppModule { }
