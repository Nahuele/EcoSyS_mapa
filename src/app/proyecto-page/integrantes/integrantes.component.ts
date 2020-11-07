import {Component, Input, OnInit} from '@angular/core';
import personalFields from '../../../assets/personalFields.json';

@Component({
  selector: 'app-integrantes',
  templateUrl: './integrantes.component.html',
  styleUrls: ['./integrantes.component.css']
})
export class IntegrantesComponent implements OnInit {

  public personalFields: { label: string; field: string }[] = personalFields;
  constructor() { }

  @Input() person;

  ngOnInit(): void {
  }

}
