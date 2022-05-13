/* 
1) There's a proper Angular wrapper for the popover component.  You can see how it's "simply used" in the app.component.html page.
2) I set up a MutationObserver onAfterViewInit.  This is a native javascript method for observing the DOM for changes, and I'm looking for when the ".dds__popover-dialog" gets added to the DOM.  I properly cease observing onDestroy.
3) When the popover dialog shows, I attach an event listener to an hyperlink by ID.  This event listener is destroyed when the element is removed from the DOM.  Once inside this listener, you're back on the Angular component's frame of reference.
*/

import {
  Component,
  ElementRef,
  ViewChild,
  OnInit,
  OnDestroy,
  AfterViewInit,
  Input
} from "@angular/core";
// import { Popover } from '@dds-uicore/all';
declare var UIC: any; // Use declare if you import via CDN. Regular Angular (node_modules) usage would be via an import

@Component({
  selector: "uic-popover",
  templateUrl: "./popover.component.html",
  styleUrls: ["./popover.component.scss"]
})
export class PopoverComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild("rootContainer") rootContainer: ElementRef<HTMLElement>;
  @ViewChild("contentContainer") contentContainer: ElementRef;
  @Input() pPlacement: string;
  @Input() pTitle: string;
  @Input() pContent: any;
  private uniqueId: number;
  private observers: Array<any>;

  constructor(private elRef: ElementRef) {}

  ngOnInit() {
    this.uniqueId = window.crypto.getRandomValues(new Uint32Array(10))[0];
    this.observers = [];
  }

  handleFoundComponents(elems: any) {
    const self = this;
    elems.forEach((el) => {
      el.querySelector("#changeMe").addEventListener(
        "click",
        function tieIntoAngular(e) {
          alert(
            "You clicked the link in the popup generated from button " +
              self.uniqueId
          );
        }
      );
    });
  }

  ngAfterViewInit() {
    let self = this,
      components = [".dds__popover-dialog"];

    if (this.contentContainer.nativeElement) {
      this.pContent = this.contentContainer.nativeElement.innerHTML;
      this.contentContainer.nativeElement.remove();
    }

    components.forEach(function (initr) {
      self.observers.push(
        new MutationObserver(function (mutations, me) {
          var targetElems = document.querySelectorAll(initr);
          if (targetElems.length > 0) {
            self.handleFoundComponents(targetElems);
            // me.disconnect(); // stop observing
            return;
          }
        })
      );
    });

    // start observing
    self.observers.forEach(function (observer) {
      observer.observe(document, {
        childList: true,
        subtree: true
      });
    });
    const componentOptions = {
      data_title: "Please pass title content",
      data_placement: "top",
      data_content:
        'Please pass <a id="changeMe" href="#">popover content</a> from your initiating component.'
    };
    if (this.pPlacement) {
      componentOptions.data_placement = this.pPlacement;
    }
    if (this.pTitle) {
      componentOptions.data_title = this.pTitle;
    }
    if (this.pContent) {
      componentOptions.data_content = this.pContent;
    }

    const content = this.rootContainer.nativeElement;
    if (content) {
      const actualContent =
        content.children && content.children.length > 0
          ? content.children[0]
          : content;

      // needed by @dds-uicore
      actualContent.setAttribute("data-toggle", "dds__popover");
      new UIC.Popover(actualContent, componentOptions); // would not need "UIC." if importing via node_modules
    }
  }

  ngOnDestroy() {
    this.observers.forEach((obs) => {
      obs.disconnect(); // stop observing
    });
  }
}
