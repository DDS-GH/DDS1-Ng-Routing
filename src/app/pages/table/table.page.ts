import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { createElement, Uuid } from "src/app/lib/helpers/dds.helpers";

declare const UIC: any;
declare const DDS: any;

@Component({
  templateUrl: "./table.page.html",
  styleUrls: ["./table.page.scss"]
})
export class TablePageComponent implements OnInit {
  @ViewChild(`myTable`) myTable!: ElementRef<HTMLElement>;
  public aria: string = `hardcoded aria`;
  public config: any = {};
  public showActions: boolean = false;
  private pageLevelAllSelectedRows: Array<number> = [];

  ngOnInit(): void {
    window.customFunction = (e: any) => {
      alert(`Using this is tricky in Angular`);
    };
    this.getData()
      .then((data) => this.createOptions(data))
      .then((options) => {
        this.config = options;
      });
  }

  async getData(): Promise<any> {
    const data = await fetch(
      "https://jsonplaceholder.typicode.com/users/"
    ).then((response) => response.json());
    return data;
  }

  async createOptions(data: any): Promise<any> {
    this.showActions = !this.showActions;

    this.config = {
      actions: false,
      additionalActions: [{ html: `Custom Function`, js: `customFunction()` }],
      allowedImportExtensions: [`.csv`, `.json`, `.js`],
      buttonLabelLeft: `Previous`,
      buttonLabelRight: `Next`,
      column: true,
      condensed: true,
      data: {
        headings: [`Id`, `Name`, `Username`, `Actions`, `Email`, `Tooltip`],
        columns: [{ select: 0, sort: `asc`, fixed: true }],
        rows: []
      },
      disablePaginationInput: true,
      defaultBatchActions: {
        exportCsv: true,
        exportJson: false,
        delete: true
      },
      expand: true,
      expandIcon: `arrow-tri-solid-right`,
      exportDetails: true,
      exportFileName: `order_export`,
      exportShowWarning: false,
      fixedColumns: true,
      fixedHeight: false,
      header: true,
      import: false,
      // items: 0,
      // layout: {
      //   row1: `{placeholder:2:start}{settings:1:end}`,
      //   row2: `{actions:1:start}{placeholder:1}{search:1:center}`
      // },
      perPage: 4,
      perPageSelect: [2, 4, 5, 8, 10],
      print: false,
      rearrangeableColumns: false,
      search: true,
      select: true,
      settings: true,
      showData: true,
      sort: true,
      text: {
        apply: `Apply`,
        cancel: `Cancel`,
        exportCsv: `Export as Csv`,
        exportJson: `Export as Json`,
        delete: `Delete`,
        noEntries: `No Entries found`,
        import: `Import`,
        print: `Print`,
        columns: `Columns`,
        batchActions: `Batch Actions`,
        chooseAction: `Choose Actions`,
        itemsPerPageText: `Pagination label`
      }
    };

    const returnObj = {
      ...this.config,
      items: data.length,
      data: {
        headings: this.config.data.headings,
        columns: this.config.data.columns,
        rows: await data.map((obj: any) => {
          // ... and structure data from the api the way we want
          return {
            data: [
              obj.id,
              obj.name,
              obj.username,
              `<actionholder>${Uuid()}</actionholder>`, // obj.actions
              obj.email,
              `<tipholder data-title="Title ${Uuid()}" data-body="${Uuid()} I rule on my back you rub my tummy i bite you hard i like big cats and i can not lie">${Uuid()}</tipholder>` // obj.website
            ],
            details: `<tableholder>${Uuid()}</tableholder>`
          };
        })
      },
      render: () => {
        const tableRootEl = this.myTable.ddsElement.parentElement.parentElement;
        // add a placeholder to the search bar:
        tableRootEl
          .querySelector(`.dds__table-cmplx-search input`)
          .setAttribute(`placeholder`, `Filter Table`);

        // hide/show a column
        const settingsEl = tableRootEl.querySelector(
          `.dds__table-cmplx-settings`
        );
        settingsEl.querySelector(`.dds__table-cmplx-settings-button`).click();
        const actionsCheckbox = settingsEl.querySelectorAll(
          `.dds__table-cmplx-li input`
        )[3];
        if (
          (!this.showActions && actionsCheckbox.checked) ||
          (this.showActions && !actionsCheckbox.checked)
        ) {
          actionsCheckbox.click();
          settingsEl
            .querySelector(`[data-toggle="data-column-box"] .dds__btn-primary`)
            .click();
        } else {
          settingsEl
            .querySelector(
              `[data-toggle="data-column-box"] .dds__btn-secondary`
            )
            .click();
        }

        // RENDER in-row TABLES:
        this.myTable.ddsElement
          .querySelectorAll(`tableholder`)
          .forEach((th: any) => {
            const rowId = th.innerHTML.trim();
            const newDiv = createElement("div", {
              style: "background: white;"
            });
            const newTable = createElement("table", {
              id: rowId,
              "data-table": "dds__table",
              class: "dds__table dds__table-hover dds__table-cmplx",
              "data-table-data": `{"showData":false,"search":false,"select":false,"settings":false,"sort":false,"expand":false,"fixedColumns":true,"fixedHeight":false,"header":true,
            "data":{"headings":["Name","Company","Extension","Start Date","Email","Phone","Link"],
            "columns":[{"select":0,"sort":"asc","fixed":true},{"select":[1,2],"hidden":true,"fixed":true},{"select":3,"type":"date","format":"MM/DD/YYYY","sortable":true}],
            "rows":[{"data":["Hedwig F. Nguyen","Arcu Vel Foundation","9875","03/27/2017","nunc.ullamcorper@metusvitae.com","070 8206 9605","<a href=&#39;//www.dell.com&#39;>Dell Home Page</a>"]},{"data":["Genevieve U. Watts","Eget Incorporated","9557","07/18/2017","Nullam.vitae@egestas.edu","0800 025698","<a href=&#39;//www.dell.com&#39;>Dell Home Page</a>"],"details":"Genevieve U. Watts details"}]}}`
            });
            newDiv.appendChild(newTable);
            th.parentElement.appendChild(newDiv);
            th.remove();
            UIC.Table(document.getElementById(rowId));
          });

        // RENDER in-row TOOLTIPS:
        // See the more Angular way to do this with the DDS2 library
        // https://confluence.dell.com/display/DDSYS/DDS2+Angular+Sandbox
        this.myTable.ddsElement
          .querySelectorAll(`tipholder`)
          .forEach((ph: any) => {
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
      }
    };
    return returnObj;
  }

  updateData() {
    this.getData()
      .then((data) => this.createOptions(data))
      .then((options) => {
        const d = new Date();
        let minutes = d.getMinutes();
        let seconds = d.getSeconds();
        options.data.rows[0].data[2] = "UPDATED " + minutes + seconds;
        this.config = options;
      });
  }

  noResults() {
    this.getData()
      .then((data) => this.createOptions(data))
      .then((options) => {
        options.data.rows = [];
        this.config = options;
      });
  }

  handleCheckbox(e: any) {
    this.pageLevelAllSelectedRows = e;
  }

  export() {
    this.myTable.ddsComponent.export({ skipColumn: [1, 2], type: "csv" });
  }
}
