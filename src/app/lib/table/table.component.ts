import { Component, Input, OnChanges, SimpleChanges } from "@angular/core";
import { DdsComponent } from "../helpers/dds.component";

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

  ngAfterViewInit(): void {
    super.ngAfterViewInit();
    this.ddsElement.addEventListener(`uicTablePageChangedEvent`, (e: any) => {
      if (this.ddsOptions.render) {
        this.ddsOptions.render();
      }
    });
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
    if (this.ddsOptions.render) {
      this.ddsOptions.render();
    }
  }
}
