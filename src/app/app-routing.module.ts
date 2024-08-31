import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TestamentsComponent } from './testaments/testaments.component';
import { DisplayBookComponent } from './display-book/display-book.component';
import { SearchComponent } from './search/search.component';
import { AboutComponent } from './about/about.component';
import { WidgetComponent } from './widget/widget.component';
import { NotFoundComponent } from './not-found/not-found.component';

const routes: Routes = [
  { path: '',
  redirectTo: 'book',
  pathMatch: 'full',
  },
  { path: 'testaments',
    component: TestamentsComponent,
  },
  { path: 'search',              
  component: SearchComponent, 
  },
  { path: 'about',              
  component: AboutComponent, 
  },
  { path: 'widget',              
  component: WidgetComponent, 
  },
  { path: 'book/:id',    //this works, however gives an error code 404 from static server (github pages) on reload
    component: DisplayBookComponent,
  },
  { path: 'book',              
    component: DisplayBookComponent, 
  },
   /* Custom 404 page not found - THIS MUST BE LAST ON THIS LIST*/
  { path: '**',
    component: NotFoundComponent
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      // enableTracing: true,
    // anchorScrolling: 'enabled', //needed for chapter selection and scroll
    // scrollOffset: [0, 200], // needed for search link 
      
    //relativeLinkResolution: 'legacy', //no longer works angular 15
    //onSameUrlNavigation: 'reload', // necessary for history books to load properly //nope this is not true
    // scrollPositionRestoration: 'enabled', 
})
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }