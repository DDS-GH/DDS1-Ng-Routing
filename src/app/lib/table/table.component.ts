import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges
} from "@angular/core";
import { debug } from "console";
import { DdsComponent } from "../helpers/dds.component";
import { arrayRemove, debounce } from "../helpers/dds.helpers";

@Component({
  selector: `uic-table`,
  templateUrl: `./table.component.html`,
  styleUrls: [`./table.component.scss`]
})
export class TableComponent extends DdsComponent implements OnChanges {
  @Input() config: any = ``;
  @Input() aria: string = ``;
  @Output() onChecked: EventEmitter<Array<number>> = new EventEmitter<
    Array<number>
  >();
  private allSelectedRows: Array<any> = []; // this would be a list of selections that we maintain manually
  private allCheckboxListeners: Array<any> = [];
  private rowIdColumnIndex = 2;

  // @ts-ignore
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
        "https://uicore.dellcdn.com/1.6.1/svgs/dds__gear.svg",
        "https://uicore.dellcdn.com/1.6.1/svgs/dds__filter.svg"
      ],
      false
    );
  }

  // @ts-ignore
  ngAfterViewInit(): void {
    super.ngAfterViewInit();
    const render = () => {
      this.addCheckboxListeners();
      this.reselectRows(this.allSelectedRows);
      if (this.ddsOptions.render) {
        this.ddsOptions.render();
      }
    };
    this.ddsElement.addEventListener(`uicPaginationPageUpdateEvent`, render);
    this.ddsElement.addEventListener(`uicTablePageChangedEvent`, render);
    this.ddsElement.addEventListener(`uicTableNewPageEvent`, render);
    this.ddsElement.addEventListener(
      `uicTableSearchEvent`,
      debounce(() => render())
    );
    this.ddsElement.addEventListener(
      `uicTableUpdateEvent`,
      debounce(() => render())
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.ddsElement) {
      this.ddsElement.selectedRows = [];
      this.allSelectedRows = [];
    }
    if (
      changes[`config`].currentValue.data &&
      changes[`config`].currentValue.data.rows.length > 0
    ) {
      this.reloadTableData(changes[`config`].currentValue);
    } else if (!changes[`config`].firstChange) {
      const firstRow = this.ddsElement.querySelector(`tr`);
      const colCount = firstRow.querySelectorAll(`th`).length;
      // allSelectedRows = [];
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
    this.reselectRows(this.allSelectedRows);
  }

  emitSelection() {
    // debug(`emitSelection`);
    // const emitRows: Array<number> = [];
    // this.allSelectedRows.forEach((sr: string) => {
    //   emitRows.push(Number(sr));
    // });
    this.onChecked.emit(this.allSelectedRows);
  }

  reselectRows(whichIdsSelected: Array<any>) {
    this.ddsElement.selectedRows = [];
    // go back through and re-select rows if their IDs are showing
    const tableRows = this.ddsElement.querySelectorAll(
      `:scope > tbody > tr:not(.dds__table-cmplx-row-details)`
    );
    tableRows.forEach((tRow: any, rowIndex: number) => {
      const tCol = tRow.querySelectorAll(":scope > td")[this.rowIdColumnIndex];
      if (tCol) {
        const rowId = tCol.innerText;
        if (whichIdsSelected.includes(rowId)) {
          this.ddsElement.selectedRows.push(rowIndex);
          tRow.querySelector("input").checked = true;
        }
      }
    });
    const firstRow = this.ddsElement.querySelector("tr");
    firstRow.querySelector("input").indeterminate = false;
    firstRow.querySelector("input").checked = false;
    if (whichIdsSelected.length > 0) {
      if (whichIdsSelected.length >= tableRows.length) {
        firstRow.querySelector("input").checked = true;
      } else {
        firstRow.querySelector("input").indeterminate = true;
      }
    }
    debug(`reselect END`, {
      selectedRows: this.ddsElement.selectedRows,
      whichIdsSelected: whichIdsSelected
    });
  }

  addCheckboxListeners = () => {
    const allBox = this.ddsElement.querySelector(
      `.dds__table-cmplx-select-all`
    );
    if (allBox) {
      allBox.removeEventListener(`click`, this.handleCbClick);
      allBox.addEventListener(`input`, this.handleAllClick);
    } else {
      debug(`select-all checkbox not found`);
    }

    this.allCheckboxListeners.forEach((cbListener) => {
      cbListener.removeEventListener(`click`, this.handleCbClick);
    });
    this.allCheckboxListeners = [];
    this.ddsElement
      .querySelectorAll(`.dds__table-cmplx-row-select input`)
      .forEach((cb: any) => {
        this.allCheckboxListeners.push(cb);
        cb.addEventListener(`click`, this.handleCbClick);
      });
  };

  handleAllClick = (e: any) => {
    this.allSelectedRows = [];
    if (e.target.checked) {
      this.ddsOptions.data.rows.forEach((rowObj: any) => {
        this.allSelectedRows.push(rowObj.data[0]);
      });
    }
    debug(`allBox clicked`, this.allSelectedRows);
    this.reselectRows(this.allSelectedRows);
    this.emitSelection();
  };

  handleCbClick = (e: any) => {
    debug(`handleCbClick`);
    // this is a little hardcoded to the particular data, presuming the "ID" of the row is column 1
    const thisRow = e.target.parentElement.parentElement;
    const orderId = thisRow.querySelectorAll("td")[this.rowIdColumnIndex]
      .innerText;
    if (this.allSelectedRows.includes(orderId)) {
      this.allSelectedRows = arrayRemove(this.allSelectedRows, orderId) || [];
    } else {
      this.allSelectedRows.push(orderId);
    }
    this.reselectRows(this.allSelectedRows);
    this.emitSelection();
  };
}
