import { GridSize } from "../systems/hex_grid/HexagonGrid";
import { GenerationSettings } from "../systems/world_generation/WorldModel";

// Temp till we get a game setup menu
export const defaultGridSize: GridSize = {
    width: 40,
    height: 30
}

export const defaultGenerationSettings: GenerationSettings = {
    seed: "default",
    castlesCount: 8,
    cavesCount: 4,
    farmsCount: 14,
    villagesCount: 14
}
