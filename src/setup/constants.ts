import { GridSize } from "../systems/hex_grid/HexagonGrid";
import { GenerationSettings } from "../systems/world_generation/WorldModel";

// Temp till we get a game setup menu
export const defaultGridSize: GridSize = {
    width: 30,
    height: 30
}

export const defaultGenerationSettings: GenerationSettings = {
    seed: "arcane_empire",
    castlesCount: 4,
    cavesCount: 4,
    farmsCount: 8,
    villagesCount: 8
}
