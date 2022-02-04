import { Component, OnInit } from '@angular/core';
import { AccordionConfig } from 'ngx-bootstrap/accordion';

// export function getAccordionConfig(): AccordionConfig {
//   return Object.assign(new AccordionConfig(), { closeOthers: true });
// }

@Component({
  selector: 'app-tutorial',
  templateUrl: './tutorial.component.html',
  styleUrls: ['./tutorial.component.css'],
  // providers: [{ provide: AccordionConfig, useFactory: getAccordionConfig }]

})
export class TutorialComponent implements OnInit {
  isFirstOpen = true;

  constructor() { }

  ngOnInit(): void {
  }

}
