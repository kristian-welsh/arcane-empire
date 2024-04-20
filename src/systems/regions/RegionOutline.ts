import { HexagonGrid } from "../hex_grid/HexagonGrid";

export class RegionOutline {

    scene: Phaser.Scene;
    hexGrid: HexagonGrid;

    constructor(scene: Phaser.Scene, hexGrid: HexagonGrid, regionHexes: Phaser.Math.Vector2[], colour: number, thickness: number) {

        this.scene = scene;
        this.hexGrid = hexGrid;

        for (let regionHex of regionHexes) {
            let neighboringHexes: Phaser.Math.Vector2[] = this.hexGrid.getGridHexNeighbours(regionHex);

            for (let neighbourHex of neighboringHexes) {

                let adjacentHexAlsoInRegion = regionHexes.some(regionHex2 => regionHex2.x == neighbourHex.x && regionHex2.y == neighbourHex.y);

                if (adjacentHexAlsoInRegion == false) {

                    // Find the two common vertices and draw a line
                    let primaryHexCorners: Phaser.Math.Vector2[] = this.hexGrid.getPixelHexCorners(regionHex);
                    let neighbourHexCorners: Phaser.Math.Vector2[] = this.hexGrid.getPixelHexCorners(neighbourHex);

                    let commonVerts: Phaser.Math.Vector2[] = primaryHexCorners.filter(hexVert => neighbourHexCorners.some(adjHexVert => Math.abs(adjHexVert.x - hexVert.x) < 1 && Math.abs(adjHexVert.y - hexVert.y) < 1));

                    let lineGraphic = scene.add.graphics();
                    lineGraphic.lineStyle(thickness, colour);
                    lineGraphic.strokeLineShape(new Phaser.Geom.Line(commonVerts[0].x, commonVerts[0].y, commonVerts[1].x, commonVerts[1].y))
                }
            }
        }

    }

}


