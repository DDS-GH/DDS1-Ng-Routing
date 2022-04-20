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

  ngOnInit(): void {
    this.getData()
      .then((data) => this.createOptions(data))
      .then((options) => {
        this.initTable(options);
      });
  }

  ngAfterViewInit(): void {
    this.tableElement.ddsElement.addEventListener(
      `uicTablePageChangedEvent`,
      (e: any) => {
        console.log(e.detail);
      }
    );
  }

  async getData(): Promise<any> {
    const data = await fetch(
      "https://jsonplaceholder.typicode.com/users/"
    ).then((response) => response.json());
    return data;
  }

  async createOptions(data: any): Promise<any> {
    this.config = {
      settings: true,
      print: false,
      import: false,
      column: true,
      sort: true,
      select: true,
      expand: false,
      condensed: true,
      fixedColumns: true,
      fixedHeight: false,
      exportDetails: false,
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
        headings: [
          `Id`,
          `Name`,
          `Username`,
          `Actions`,
          `Email`,
          `Tooltip <tipholder data-title="Title ${Uuid()}" data-body="Spread kitty litter all over house human is in bath tub, emergency! drowning! meooowww! mew mew cat fur is the new black but meow in empty rooms eat the rubberband. Kitty kitty hack, but licks paws make meme, make cute face but try to hold own back foot to clean it but foot reflexively kicks you in face, go into a rage and bite own foot, hard.">${Uuid()}</tipholder>`
        ],
        columns: [{ select: 0, sort: "asc", fixed: true }],
        rows: []
      }
    };

    return {
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
            ]
          };
        })
      },
      render: () => {
        // THIS METHOD RENDERS A DD2 TOOLTIP MANUALLY
        // TODO: Look into instatiating this as a wrapped component
        // Probably something like https://stackoverflow.com/questions/51495787/angular-dynamically-inject-a-component-in-another-component
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
  }

  initTable(options: any) {
    this.config = options;
  }

  updateData() {
    this.getData()
      .then((data) => this.createOptions(data))
      .then((options) => {
        const d = new Date();
        let minutes = d.getMinutes();
        let seconds = d.getSeconds();
        options.data.rows[0].data[2] = "UPDATED " + minutes + seconds;

        //this.initTable(options);
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
}
