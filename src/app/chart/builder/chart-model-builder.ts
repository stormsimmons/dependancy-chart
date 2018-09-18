import { ChartModel } from "../models/chart-model";
import { IChartData } from "../models/chart-data";

export  class ChartModelBuilder {

    public static build(data: IChartData[]): Promise<ChartModel> {

        return new Promise<ChartModel>((res, rej) => {
            const edges: any[] = [];
            const dependantNames:string[] = []

            const nodes = data.map(item => {
                item.dependantIds.forEach(dependant => {
                    let name = data.find(x => x.id == dependant).name;
                    dependantNames.push(name);
                    edges.push({
                        source: item.name,
                        target : name
                    })
                });

                return {
                    id : item.id,
                    name : item.name,
                    type : item.type,
                    dependantNames : dependantNames
                };
            });

            res(new ChartModel(nodes, edges));
        })
    }

}