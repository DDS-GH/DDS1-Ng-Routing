import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  templateUrl: "./home.page.html",
  styleUrls: ["./home.page.scss"]
})
export class HomePageComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {}

  // onLoadServers() {
  //   // complex calculation
  //   this.router.navigate(['/servers']);
  // }
}
