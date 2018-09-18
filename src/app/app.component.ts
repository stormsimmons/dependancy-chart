import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http'
import { IChartData } from './chart/models/chart-data';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  title = 'app';

  public data: any[]
  public entry: IChartData

  constructor(private http: Http) { }

  public ngOnInit() {
    this.http.get('assets/data.json').subscribe(res => {
      this.data = res.json();
    })
  }

  public onChartClick(node:IChartData) {
    this.entry = node;
  }

}
