import { Component, ElementRef, ViewChild } from "@angular/core";
import { DdsComponent } from "../helpers/dds.component";
import { confirmOverlay } from "../helpers/dds.helpers";

@Component({
  selector: `uic-modal`,
  templateUrl: `./modal.component.html`
})
export class ModalComponent extends DdsComponent {
  @ViewChild("triggerContainer") triggerContainer: ElementRef<HTMLElement>;

  ngOnInit(): void {
    super.ngOnInit();
    this.ddsInitializer = ``; // abort using DdsComponent?
    confirmOverlay();
  }

  ngAfterViewInit() {
    const content = this.triggerContainer.nativeElement;
    if (content) {
      // If the modal-trigger ngcontent is plain text then we want to work with the contentContainer.
      // If otherwise modal-trigger ngcontent has one or more tags we want to work with the first child of contentContainer.
      const actualContent =
        content.children && content.children.length > 0
          ? content.children[0]
          : content;
      // This two attributes are needed by @dds-uicore Modal
      actualContent.setAttribute("data-toggle", "dds__modal");
      actualContent.setAttribute("data-target", `#${this.elementId}`);
      this.ddsComponent = new UIC.Modal(actualContent);
    }
    super.ngAfterViewInit();
  }
}
