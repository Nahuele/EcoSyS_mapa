import { Component, OnInit } from '@angular/core';
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {MarkdownService} from "ngx-markdown";

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {
  constructor(private markdownService: MarkdownService, private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
  }

}
