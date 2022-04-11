import { Component, Input, OnChanges, SimpleChanges } from "@angular/core";
import { DdsComponent } from "../helpers/dds.component";
import { createElement, Uuid } from "../helpers/dds.helpers";

declare const DDS: any;

@Component({
  selector: `uic-table`,
  templateUrl: `./table.component.html`,
  styleUrls: [`./table.component.scss`]
})
export class TableComponent extends DdsComponent implements OnChanges {
  @Input() config: any = ``;
  @Input() aria: string = ``;

  ngOnInit(): void {
    super.ngOnInit();
    this.ddsInitializer = `Table`;
    this.ddsOptions = this.config;

    // Some UICore components require SVGs; loadURLSVGs accepts two parameters: an array of the SVGs to load, and a boolean for whether or not to lazy-load.  True by default; this Sandbox requires False.
    UIC.loadURLSVGs(
      [
        "https://uicore.dellcdn.com/1.6.1/svgs/dds__search.svg",
        "https://uicore.dellcdn.com/1.6.1/svgs/dds__import-alt.svg",
        "https://uicore.dellcdn.com/1.6.1/svgs/dds__handle.svg",
        "https://uicore.dellcdn.com/1.6.1/svgs/dds__chevron-right.svg",
        "https://uicore.dellcdn.com/1.6.1/svgs/dds__chevron-left.svg",
        "https://uicore.dellcdn.com/1.6.1/svgs/dds__loading-sqrs.svg",
        "https://uicore.dellcdn.com/1.6.1/svgs/dds__chevron-right.svg",
        "https://uicore.dellcdn.com/1.6.1/svgs/dds__arrow-tri-solid-right.svg",
        "https://uicore.dellcdn.com/1.6.1/svgs/dds__printer.svg",
        "https://uicore.dellcdn.com/1.6.1/svgs/dds__gear.svg"
      ],
      false
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes[`config`].currentValue.data &&
      changes[`config`].currentValue.data.rows.length > 0
    ) {
      this.reloadTableData(changes[`config`].currentValue);
    } else if (!changes[`config`].firstChange) {
      const firstRow = this.ddsElement.querySelector(`tr`);
      const colCount = firstRow.querySelectorAll(`th`).length;
      // allSelectedRows = [];
      this.ddsElement.selectedRows = [];
      const config = {
        ...changes[`config`].currentValue,
        data: {
          headings: changes[`config`].currentValue.data.headings,
          columns: changes[`config`].currentValue.data.columns,
          rows: []
        }
      };
      this.reloadTableData(config);
      //reselectRows(allSelectedRows);
      // tableElement.appendChild
      const noCol = document.createElement(`td`);
      noCol.setAttribute(`colspan`, colCount);
      noCol.style.textAlign = `center`;
      noCol.innerText = `No Results`;
      const noRow = document.createElement(`tr`);
      noRow.id = `${this.elementId}NoResults`;
      noRow.appendChild(noCol);
      this.ddsElement.appendChild(noRow);
    }
  }

  reloadTableData(options: { data: any }) {
    if (!options.data) {
      return;
    }
    const noRow = this.ddsElement.querySelector(`#${this.elementId}NoResults`);
    if (noRow) noRow.remove();
    // converts all to strings
    options.data.rows.map((r: any, rI: number) => {
      r.data.map((td: any, tdI: number) => {
        options.data.rows[rI].data[tdI] = td.toString();
      });
    });

    if (!this.ddsComponent) {
      this.ddsOptions = options;
      this.initializeNow();
    } else {
      this.ddsComponent.page(1);
      this.ddsComponent.deleteAll();
      this.ddsComponent.import(options);
      this.ddsComponent.setItems(options.data.rows.length);
    }
    this.renderInlineComponents();
  }

  renderInlineComponents() {
    // this.renderTablePlaceholders();
    this.renderTooltipPlaceholders();
  }

  renderTooltipPlaceholders = () => {
    // THIS METHOD RENDERS A DD2 TOOLTIP MANUALLY
    // TODO: Look into instatiating this as a wrapped component
    this.ddsElement.querySelectorAll(`tipholder`).forEach((ph: any) => {
      const tipspot = ph.parentElement;
      const rowId = ph.innerHTML.trim();

      const tipTrigger = createElement(`a`, {
        id: `trigger${rowId}`,
        class: `dds__link--standalone`,
        href: `javascript:void(0);`,
        "aria-describedby": `tip${rowId}`
      });

      const triggerAria = createElement(`span`, {
        class: `dds__sr-only`
      });
      triggerAria.innerText = `tooltip`;

      const triggerIcon = createElement(`i`, {
        class: `dds__icon dds__icon--alert-info-cir`
      });

      const tip = createElement(`div`, {
        id: `tip${rowId}`,
        class: `dds__tooltip`,
        role: `tooltip`,
        "data-trigger": `#trigger${rowId}`,
        "data-dds": `tooltip`
      });

      const tipBody = createElement(`div`, {
        class: `dds__tooltip__body`
      });
      tipBody.innerText = ph.getAttribute(`data-body`);

      const tipHeader = createElement(`h6`, {
        class: `dds__tooltip__title`
      });
      tipHeader.innerText = ph.getAttribute(`data-title`);

      tipTrigger.appendChild(triggerAria);
      tipTrigger.appendChild(triggerIcon);
      tipspot.appendChild(tipTrigger);
      tipspot.appendChild(tip);
      tip.appendChild(tipBody);
      tipBody.prepend(tipHeader);
      ph.remove();
      DDS.Tooltip(document.getElementById(`tip${rowId}`));
    });
  };
}
