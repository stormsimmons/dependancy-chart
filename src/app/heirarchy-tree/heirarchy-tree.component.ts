import { Component, OnInit, Input, OnChanges, SimpleChanges, ElementRef } from '@angular/core';
import { TreeBuilder } from './builders/tree-builder';
import { IChartData } from '../chart/models/chart-data';
import * as d3 from 'd3';
import { TreeNode } from './models/node';
import { Observable, Subscription, fromEvent } from 'rxjs';
@Component({
  selector: 'app-heirarchy-tree',
  templateUrl: './heirarchy-tree.component.html',
  styleUrls: ['./heirarchy-tree.component.css']
})
export class HeirarchyTreeComponent implements OnChanges {

  @Input()
  public data: IChartData[];

  @Input()
  public entry: IChartData;

  private tree: TreeNode;

  public toolTipDatumn: any;
  public showToolTip: boolean = false;
  public mouseMoveObs: Observable<any> = fromEvent(document.body, 'mousemove');
  public mouseMoveSub: Subscription;
  public pointerX: number
  public pointerY: number

  constructor(private elRef : ElementRef) { }

  ngOnChanges(simpleChange: SimpleChanges) {
    console.log(simpleChange)
    if('entry' in simpleChange){
    let builder = new TreeBuilder()

    this.tree = builder.build(this.data, this.entry);

    this.draw();
    }
  }

  public draw(): void {
    let svg = d3.select("svg#tree"),
      width = +svg.attr("width"),
      height = +svg.attr("height");

      svg.selectAll('g').remove()


    var root = d3.hierarchy(this.tree)

    let treeLayout = d3.tree()
    treeLayout.size([500, 200]);
    treeLayout(root);

    svg.append('g')
    .attr("class","links");
    svg.append('g')
    .attr("class","nodes");

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

    // Nodes
    d3.select('svg#tree g.nodes')
      .selectAll('circle.node')
      .data(root.descendants())
      .enter()
      .append('circle')
      .classed('node', true)
      .attr('fill', (d: any) => {
        switch (d.data.datumn.type) {
          case "Service":
            return "cornflowerblue";
          case "Client":
            return "orange";
          default:
            return "black"
        }
      })
      .attr('cx',  (d: any) =>  d.x + width / 3 )
      .attr('cy',  (d: any) =>  d.y + height / 4 )
      .attr('r', 15)
      .on('mouseover', d => {
        this.toolTipDatumn = d.data.datumn;
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
      });

    // Links
    d3.select('svg#tree g.links')
      .selectAll('line.link')
      .data(root.links())
      .enter()
      .append('line')
      .classed('link', true)
      .attr('x1',  (d: any) => d.source.x + width / 3)
      .attr('y1',  (d: any) => d.source.y + height / 4)
      .attr('x2',  (d: any) => d.target.x + width / 3)
      .attr('y2',  (d: any) => d.target.y + height / 4)
      .attr('stroke', 'grey')
      .attr("stroke-width", 2)
      .attr('marker-end', 'url(#arrowhead)');

  }

}
