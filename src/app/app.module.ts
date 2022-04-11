import { BrowserModule } from "@angular/platform-browser";
import { NgModule, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";
import { ReactiveFormsModule } from "@angular/forms";

// sandbox pages
import { AppComponent } from "./app.component";
import { HomePageComponent } from "./pages/home/home.page";
import { TablePageComponent } from "./pages/table/table.page";
import { ModalPageComponent } from "./pages/modal/modal.page";

// library components
import { HeaderComponent } from "./lib/header/header.component";
import { TableComponent } from "./lib/table/table.component";
import { ModalComponent } from "./lib/modal/modal.component";

// directives

const appRoutes: Routes = [
  { path: "", component: HomePageComponent },
  { path: "modal", component: ModalPageComponent },
  { path: "table", component: TablePageComponent }
];

const components = [HeaderComponent, ModalComponent, TableComponent];

const pages = [HomePageComponent, ModalPageComponent, TablePageComponent];

// const directives = [IsSelectedDirective];

@NgModule({
  declarations: [AppComponent, ...components, ...pages],
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
