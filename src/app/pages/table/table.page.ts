import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild
} from "@angular/core";
import { createElement, Uuid } from "src/app/lib/helpers/dds.helpers";

declare const DDS: any;

@Component({
  templateUrl: "./table.page.html"
})
export class TablePageComponent implements OnInit, AfterViewInit {
  @ViewChild(`tableElement`) tableElement!: ElementRef<HTMLElement>;
  public aria: string = `hardcoded aria`;
  public config: any = {};
  public showActions: boolean = false;

  ngOnInit(): void {
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
      settings: true,
      print: false,
      import: false,
      column: true,
      sort: true,
      select: true,
      expand: true,
      condensed: true,
      fixedColumns: true,
      fixedHeight: false,
      exportDetails: true,
      exportFileName: "order_export",
      disablePaginationInput: true,
      header: true,
      text: {
        batchActions: "Actions"
      },
      defaultBatchActions: {
        exportCsv: true,
        exportJson: false,
        delete: false
      },
      additionalActions: [],
      search: false,
      actions: false,
      perPage: 4,
      perPageSelect: [2, 4, 5, 8, 10],
      data: {
        headings: [`Id`, `Name`, `Username`, `Actions`, `Email`, `Tooltip`],
        columns: [{ select: 0, sort: "asc", fixed: true }],
        rows: []
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
            details: obj.name + ` details`
          };
        })
      },
      render: () => {
        // THIS METHOD RENDERS A DD2 TOOLTIP MANUALLY
        // See the more Angular way to do this with the DDS2 library
        // https://confluence.dell.com/display/DDSYS/DDS2+Angular+Sandbox
        this.tableElement.ddsElement
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

  export() {
    this.tableElement.ddsComponent.export({ skipColumn: [1, 2], type: "csv" });
  }
}
