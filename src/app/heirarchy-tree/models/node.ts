export class TreeNode {
    constructor(
        public datumn:any
    ){}
    public children: TreeNode[]
    public addNode(node: TreeNode){
        if(!this.children){
            this.children = [];
        }
        this.children.push(node);
    }
}