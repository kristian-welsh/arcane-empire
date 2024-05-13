import { HexagonGrid } from '../hex_grid/HexagonGrid';

export class RegionOutline {
  scene: Phaser.Scene;
  hexGrid: HexagonGrid;

  hexes: Phaser.Math.Vector2[];
  drawnGraphics: Phaser.GameObjects.Graphics[];

  colour: number;
  thickness: number;

  constructor(
    scene: Phaser.Scene,
    hexGrid: HexagonGrid,
    hexes: Phaser.Math.Vector2[],
    colour: number,
    thickness: number,
    draw: boolean = true
  ) {
    this.scene = scene;
    this.hexGrid = hexGrid;

    this.hexes = hexes;
    this.drawnGraphics = [];

    this.colour = colour;
    this.thickness = thickness;

    if (hexes.length == 0) return;

    if (draw) this.draw();
  }

  public setHexes(
    newHexes: Phaser.Math.Vector2[],
    redraw: boolean = true
  ): void {
    this.hexes = newHexes;

    if (redraw) {
      this.clear();
      this.draw();
    }
  }

  public clear(): void {
    for (let i = 0; i < this.drawnGraphics.length; i++) {
      this.drawnGraphics[i].destroy();
    }

    this.drawnGraphics = [];
  }

  public draw(): void {
    for (let hex of this.hexes) {
      let neighboringHexes: Phaser.Math.Vector2[] =
        this.hexGrid.getNeighbouringHexes(hex);

      for (let neighbourHex of neighboringHexes) {
        let adjacentHexAlsoInRegion = this.hexes.some(
          (item) => item.x == neighbourHex.x && item.y == neighbourHex.y
        );

        if (adjacentHexAlsoInRegion == false) {
          // Find the two common vertices and draw a line
          let primaryHexCorners: Phaser.Math.Vector2[] =
            this.hexGrid.getPixelHexCorners(hex);
          let neighbourHexCorners: Phaser.Math.Vector2[] =
            this.hexGrid.getPixelHexCorners(neighbourHex);

          let commonVerts: Phaser.Math.Vector2[] = primaryHexCorners.filter(
            (hexVert) =>
              neighbourHexCorners.some(
                (adjHexVert) =>
                  Math.abs(adjHexVert.x - hexVert.x) < 1 &&
                  Math.abs(adjHexVert.y - hexVert.y) < 1
              )
          );

          let lineGraphic = this.scene.add.graphics();

          lineGraphic.lineStyle(this.thickness, this.colour);
          lineGraphic.strokeLineShape(
            new Phaser.Geom.Line(
              commonVerts[0].x,
              commonVerts[0].y,
              commonVerts[1].x,
              commonVerts[1].y
            )
          );

          this.drawnGraphics.push(lineGraphic);

          this.hexGrid.draggableContainer?.add(lineGraphic);
        }
      }
    }
  }
}
