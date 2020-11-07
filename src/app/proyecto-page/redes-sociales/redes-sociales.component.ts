import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-redes-sociales',
  templateUrl: './redes-sociales.component.html',
  styleUrls: ['./redes-sociales.component.css']
})
export class RedesSocialesComponent implements OnInit {

  @Input() redes;

  constructor() { }

  ngOnInit(): void {
  }

}
