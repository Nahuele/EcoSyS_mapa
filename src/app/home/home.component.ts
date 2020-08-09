import { Component, OnInit } from '@angular/core';
import dbProjects from '../../assets/dbProjects.json';
import {GetProjectsService} from './get-projects.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
