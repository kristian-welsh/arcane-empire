import forest_path from "../../assets/environment/tiles/forest.png";
import grass_path from "../../assets/environment/tiles/grass.png";
import mountain_path from "../../assets/environment/tiles/mountains.png";
import ocean_path from "../../assets/environment/tiles/ocean_deep.png";

export enum TerrainType {
    Forest = "Forest",
    Grass = "Grass",
    Mountain = "Mountain",
    Ocean = "Ocean"
}

export type TerrainData = {
    name: TerrainType;
    path: string;
    is_walkable: boolean;
    walkable_difficulty: number; // Higher equals harder
};

export const TerrainTypes: (keyof typeof TerrainType)[] = <(keyof typeof TerrainType)[]>Object.keys(TerrainType);

export const TerrainDatas: Record<TerrainType, TerrainData> = {
    Forest: {
        name: TerrainType.Forest,
        path: forest_path,
        is_walkable: true,
        walkable_difficulty: 5,
    },
    Grass: {
        name: TerrainType.Grass,
        path: grass_path,
        is_walkable: true,
        walkable_difficulty: 0,
    },
    Mountain: {
        name: TerrainType.Mountain,
        path: mountain_path,
        is_walkable: true,
        walkable_difficulty: 10,
    },
    Ocean: {
        name: TerrainType.Ocean,
        path: ocean_path,
        is_walkable: false,
        walkable_difficulty: 0,
    },
};