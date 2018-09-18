import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { ChartComponent } from './chart/chart.component';
import { TooltipComponent } from './tooltip/tooltip.component';
import {HttpModule} from '@angular/http';
import { HeirarchyTreeComponent } from './heirarchy-tree/heirarchy-tree.component'


@NgModule({
  declarations: [
    AppComponent,
    ChartComponent,
    TooltipComponent,
    HeirarchyTreeComponent
  ],
  imports: [
    BrowserModule,
    HttpModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
