import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as d3 from 'd3';
import { ChartModel } from './models/chart-model';
import { ChartModelBuilder } from './builder/chart-model-builder';
import { Observable, Subscription, fromEvent } from 'rxjs';
import { IChartData } from './models/chart-data';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit {

  @Input()
  private data: IChartData[];

  @Output()
  public onClick: EventEmitter<any> = new EventEmitter<any>();

  public modelData: ChartModel;
  public toolTipDatumn: any;
  public showToolTip: boolean = false;
  public mouseMoveObs: Observable<any> = fromEvent(document.body, 'mousemove');
  public mouseMoveSub: Subscription;
  public pointerX: number
  public pointerY: number

  constructor() { }

  ngOnInit() {

    ChartModelBuilder
      .build(this.data)
      .then(res => {
        this.modelData = res;
        this.draw();
      });
  }

  private draw() {
    let svg = d3.select("svg"),
      width = +svg.attr("width"),
      height = +svg.attr("height");

    let radius = 15;

    let simulation = d3.forceSimulation()
      .nodes(this.modelData.nodes);

    let link_force = d3.forceLink(this.modelData.edges)
      .id(function (d: any) { return d.name; });

    let charge_force = d3.forceManyBody()
      .strength(-5000);

    let center_force = d3.forceCenter(width / 2, height / 2);

    svg.append('defs').append('marker')
      .attr('id', 'arrowhead')
      .attr('viewBox', '-0 -10 15 15')
      .attr('refX', 13)
      .attr('refY', 0)
      .attr('orient', 'auto')
      .attr('markerWidth', 13)
      .attr('markerHeight', 13)
      .attr('xoverflow', 'visible')
      .append('svg:path')
      .attr('d', 'M 0,-2.5 L 5 ,0 L 0,2.5')
      .attr('fill', '#999')
      .style('stroke', 'none');

    simulation
      .force("charge_force", charge_force)
      .force("center_force", center_force)
      .force("links", link_force);


    simulation.on("tick", tickActions);

    let link = svg.append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(this.modelData.edges)
      .enter().append("line")
      .attr("stroke-width", 2)
      .attr('marker-end', 'url(#arrowhead)')
      .style("stroke", 'gray');

    let node = svg.append("g")
      .attr("class", "nodes")
      .selectAll("circle")
      .data(<any>this.modelData.nodes)
      .enter().append("circle")
      .attr("r", radius)
      .attr("fill", (d: any) => {
        switch (d.type) {
          case "Service":
            return "cornflowerblue";
          case "Client":
            return "orange";
          default:
            return "black"
        }
      })
      .call(d3.drag()
        .on("start", (d: any) => {
          if (!d3.event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on("drag", (d: any) => {
          if (!d3.event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d3.event.x;
          d.fy = d3.event.y;
        })
        .on("end", (d: any) => {
          if (!d3.event.active) simulation.alphaTarget(0.3).restart();
          d.fx = null;
          d.fy = null;
        }))
      .on('mouseover', d => {
        this.toolTipDatumn = d;
        this.showToolTip = true;

        let scrollTop = document.documentElement.scrollTop

        this.mouseMoveSub = this.mouseMoveObs.subscribe(x => {
          let posX = x.clientX - 80
          let posY = x.clientY - 80 + scrollTop
          if (posY < 50) posY += 120;
          this.pointerX = posX
          this.pointerY = posY
        });
      })
      .on('mouseout', d => {
        this.showToolTip = false
        this.mouseMoveSub.unsubscribe();
      })
      .on('click', (d: any) => {
        this.onClick.emit(this.data.find(x => x.id == d.id));
      });


    function tickActions() {
      node
        .attr("cx", (d: any) => d.x = Math.max(radius, Math.min(width - radius, d.x)))
        .attr("cy", (d: any) => d.y = Math.max(radius, Math.min(height - radius, d.y)));

      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);
    }
  }
}