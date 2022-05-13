import { BrowserModule } from "@angular/platform-browser";
import { NgModule, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";
import { ReactiveFormsModule } from "@angular/forms";

// sandbox pages
import { AppComponent } from "./app.component";
import { HomePageComponent } from "./pages/home/home.page";
import { ModalPageComponent } from "./pages/modal/modal.page";
import { PopoverPageComponent } from "./pages/popover/popover.page";
import { TablePageComponent } from "./pages/table/table.page";

// library components
import { HeaderComponent } from "./lib/header/header.component";
import { ModalComponent } from "./lib/modal/modal.component";
import { PopoverComponent } from "./lib/popover/popover.component";
import { TableComponent } from "./lib/table/table.component";

// DDS2 components
import { TooltipComponent } from "./lib/tooltip/tooltip.component";

// directives

const appRoutes: Routes = [
  { path: "", component: HomePageComponent },
  { path: "modal", component: ModalPageComponent },
  { path: "popover", component: PopoverPageComponent },
  { path: "table", component: TablePageComponent }
];

const DDS1 = [
  HeaderComponent,
  ModalComponent,
  PopoverComponent,
  TableComponent
];
const DDS2 = [TooltipComponent];

const pages = [
  HomePageComponent,
  ModalPageComponent,
  PopoverPageComponent,
  TablePageComponent
];

// const directives = [IsSelectedDirective];

@NgModule({
  declarations: [AppComponent, ...DDS1, ...DDS2, ...pages],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(appRoutes),
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule implements OnInit {
  ngOnInit() {
    console.clear();
  }
}
