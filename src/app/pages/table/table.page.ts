import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild
} from "@angular/core";
import { Uuid } from "src/app/lib/helpers/dds.helpers";

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
      search: true,
      actions: false,
      perPage: 4,
      perPageSelect: [2, 4, 5, 8, 10],
      data: {
        headings: ["Id", "Name", "Username", "Actions", "Email", "Tooltip"],
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
              `<tipholder data-title="Title ${Uuid()}" data-body="${Uuid()} Body">${Uuid()}</tipholder>` // obj.website
            ]
          };
        })
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
