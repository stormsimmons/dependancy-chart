import { IChartData } from "../../chart/models/chart-data";
import { TreeNode } from "../models/node";

export class TreeBuilder {

    public build(data : IChartData[], startingPoint:IChartData ): TreeNode{
        const rootNode :TreeNode = new TreeNode(startingPoint);

        this.buildInternal(data,rootNode);
        return rootNode;
    }

    private buildInternal(data:IChartData[], node:TreeNode):void{

        data.filter(x => x.dependantIds.includes(node.datumn.id))
        .forEach(x => {
            let newNode = new TreeNode(x);
            node.addNode(newNode)
        })

        if(!node.children || node.children.length == 0) return;

        node.children.forEach(child => {
            this.buildInternal(data, child);
        });
    }


}