import {
  Component,
  AfterViewInit,
  Inject,
  ViewEncapsulation,
  OnDestroy,
  HostListener,
  DOCUMENT,
} from "@angular/core";
import { BibleService } from "../bible.service";
import { HistoryService } from "../history.service";
import { Meta, Title } from "@angular/platform-browser";
import { Location } from "@angular/common";
import * as wasm from "../../../pkg";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: "app-display-book",
  templateUrl: "./display-book.component.html",
  styleUrls: ["./display-book.component.scss"],
  encapsulation: ViewEncapsulation.None,
  standalone: false,
})
export class DisplayBookComponent implements AfterViewInit, OnDestroy {
  public renderedBook: string;

  public fragString?: string;
  public fragment?: any;
  public frag?: any;

  public fragId?: any;
  public bookPlace?: any;

  public nextFragment: string = "1-3-1-1"; // defaults to The Gospel according ot St John
  public nextButton: string = "Proceed?";
  public nextBibleBook: string = "";

  private observer: any;

  constructor(
    public bibleService: BibleService,
    public historyService: HistoryService,
    public title: Title,
    public meta: Meta,
    public router: Router,
    private location: Location,
    @Inject(DOCUMENT) public document: Document,
    private activatedRoute: ActivatedRoute,
  ) {
    this.bibleService.spinner = true;
    this.bibleService.spinnerTitle = "Rendering";

    this.meta.addTag({
      name: "description",
      content:
        "King James Version (Cambridge) Bible; utilising WebAssembly.",
    });
    title.setTitle("Bible - King James Version");

    this.fragment = this.activatedRoute.snapshot.fragment;
    if (this.fragment) {
      this.frag = this.fragment.split("-");
      if (this.frag.length > 3) {
        // only if verse exists in route
        this.bibleService.testament = Number(this.frag[0]);
        this.bibleService.bookSelected = Number(this.frag[1]);
        this.bibleService.chapterNumber = this.frag[2];
        this.bibleService.verseNumber = this.frag[3];
        this.bibleService.title =
          this.bibleService.bible[this.frag[0]].books[this.frag[1]].bookName;
        this.bibleService.showChapters = false;
        this.fragString = this.fragment.toString();
      }
    }

    this.renderedBook = wasm.render(
      this.bibleService.testament,
      this.bibleService.bookSelected,
    );

    this.bibleService.pageTitle = this.bibleService.title;
    this.bibleService.chapterButton = true;

    // Only auto open chapters if new book and history isn't populated; new uses only
    let historyPopulated = localStorage.getItem("secTestamentIndex")!;
    if (
      this.bibleService.verseNumber == "" &&
      this.bibleService.chapterNumber == "1" &&
      (historyPopulated == null || historyPopulated == "null")
    ) {
      this.bibleService.showChapters = true;
    }

    this.nextBook();
  }

  ngAfterViewInit() {
    //turn off spinner, setTimeout is necessary or doesn't work
    setTimeout(() => {
      this.bibleService.spinner = false;
    }, 10);

    // store book for loading on return, if not chosen from history -MUST BE UNDER ngAfterViewInit
    this.historyService.storeBooks();

    this.fragId = this.bibleService.fragment(); //must be worked out first

    localStorage.setItem(
      "curTestamentIndex",
      this.bibleService.testament.toString(),
    );
    localStorage.setItem(
      "curBookIndex",
      this.bibleService.bookSelected.toString(),
    );
    localStorage.setItem("curChap", this.bibleService.chapterNumber);
    localStorage.setItem("curVerse", this.bibleService.verseNumber);

    this.bookPlace = this.document.getElementById(this.fragId)!;
    this.bookPlace.scrollIntoView({
      block: "start",
      inline: "nearest",
      behavior: "instant",
    }); //instant needed to stop observer changing verse and chapter number
    this.bookPlace.focus(); //focus must be after scrollIntoView or throws error

    this.saveScrollposition();

    window.addEventListener("resize", () => {
      let id = this.bibleService.fragment();
      let bookPlace = this.document.getElementById(id)!;
      bookPlace.scrollIntoView({
        block: "start",
        inline: "nearest",
        behavior: "instant",
      }); //instant needed to stop observer changing verse and chapter number
      this.bookPlace.focus(); //focus must be after scrollIntoView or throws error
    });
  }

  ngOnDestroy() {
    // this.observer.disconnect()!; //throws error, because it is part of saveScrollposition()???
  }

  saveScrollposition() {
    // save chapter and verse on scroll
    const chapters = this.document.querySelectorAll("section > div > a, section > header > a, section > a");
    const options = {
      root: null, // viewport
      threshold: [0],
      rootMargin: "-2% 0px -95% 0px", //only top verse/s Don't change these affects reloading at correct verse; especially safari pwa
      delay: 700, //only works on safari
    };
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        let chapter = entry.target!.id ?? "0";
        let splits = chapter.split("-");
        let targetChapter = splits[2];
        let url = "/book#";
        if (entry.isIntersecting) {
          localStorage.setItem("curVerse", splits[3]);
          this.bibleService.verseNumber = splits[3];
          localStorage.setItem("curChap", targetChapter);
          this.bibleService.chapterNumber = targetChapter;
          this.location.go(url.concat(chapter)); //update url on scroll to ensure place if reloaded

          let tabTitle = this.bibleService.title.concat(" ", targetChapter);
          this.title.setTitle(tabTitle);
        }
      });
    }, options);
    chapters.forEach((chapter) => {
      this.observer.observe(chapter);
    });
  }

  nextBook() {
    if (
      (this.bibleService.testament == 0 &&
        this.bibleService.bookSelected <= 37) ||
      (this.bibleService.testament == 1 && this.bibleService.bookSelected <= 25)
    ) {
      this.nextFragment =
        this.bibleService.testament +
        "-" +
        (this.bibleService.bookSelected + 1) +
        "-0-0";
      this.nextButton = "Next Book: ";
      this.nextBibleBook =
        this.bibleService.bible[this.bibleService.testament].books[
          this.bibleService.bookSelected + 1
        ].title;
    } else if (
      this.bibleService.testament == 0 &&
      this.bibleService.bookSelected == 38
    ) {
      this.nextFragment = "1-0-0-0";
      this.nextButton = "Onward to the New Testament and ";
      this.nextBibleBook = this.bibleService.bible[1].books[0].title;
    } else if (
      this.bibleService.testament == 1 &&
      this.bibleService.bookSelected == 26
    ) {
      this.nextFragment = "1-26-22-21";
      this.nextButton = "The End";
    }
  }

  nextBookRoute() {
    if (
      (this.bibleService.testament == 0 &&
        this.bibleService.bookSelected <= 37) ||
      (this.bibleService.testament == 1 && this.bibleService.bookSelected <= 25)
    ) {
      this.bibleService.bookSelected += 1;
    } else if (
      this.bibleService.testament == 0 &&
      this.bibleService.bookSelected == 38
    ) {
      this.bibleService.testament = 1;
      this.bibleService.bookSelected = 0;
    }
    this.bibleService.chapterNumber = "0";
    this.bibleService.verseNumber = "0";
    // below is a terrible hack but can't seem to reload properly any other way
    this.router
      .navigateByUrl("/notARoute", { skipLocationChange: true })
      .then(() => {
        this.router.navigate(["book"], { fragment: this.nextFragment });
      });
  }
}
