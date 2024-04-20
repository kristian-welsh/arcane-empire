import castle_1_path from "../../assets/environment/structures/castle_1.png";
import castle_2_path from "../../assets/environment/structures/castle_2.png";
import cave_entrance_path from "../../assets/environment/structures/cave_entrence.png";
import farm_hut_1_path from "../../assets/environment/structures/farm_hut_1.png";
import farm_hut_2_path from "../../assets/environment/structures/farm_hut_2.png";
import village_small_path from "../../assets/environment/structures/village_small.png";
import wheat_farm_path from "../../assets/environment/structures/wheat_farm.png";

export enum StructureType {
    Castle = "Castle",
    Cave_Entrance = "Cave_Entrance",
    Village_Small = "Village_Small",
    Farm_Hut = "Farm_Hut",
    Wheat_Farm = "Wheat_Farm"
}

export type StructureData = {
    name: StructureType;
    path: string;
    sprite_scale: number;
    is_walkable: boolean;
    walkable_difficulty_modifier: number; // Higher equals harder

    //TODO: Terrain generation restriction filter
    //TODO: Varying graphic handling, have path as base and an number field for number of alterates. Then construct the path dynamcially.
    //TODO: Terrain squashing toggle 
};

export const StructureTypes: (keyof typeof StructureType)[] = <(keyof typeof StructureType)[]>Object.keys(StructureType);

export const StructureDatas: Record<StructureType, StructureData> = {
    Castle: {
        name: StructureType.Castle,
        path: castle_1_path,
        sprite_scale: 1.5,
        is_walkable: true,
        walkable_difficulty_modifier: 0,
    },
    Cave_Entrance: {
        name: StructureType.Cave_Entrance,
        path: cave_entrance_path,
        sprite_scale: 1.5,
        is_walkable: true,
        walkable_difficulty_modifier: 0,
    },
    Village_Small: {
        name: StructureType.Village_Small,
        path: village_small_path,
        sprite_scale: 1.5,
        is_walkable: true,
        walkable_difficulty_modifier: 0,
    },
    Farm_Hut: {
        name: StructureType.Farm_Hut,
        path: farm_hut_1_path,
        sprite_scale: 1.5,
        is_walkable: true,
        walkable_difficulty_modifier: 0,
    },
    Wheat_Farm: {
        name: StructureType.Wheat_Farm,
        path: wheat_farm_path,
        sprite_scale: 1.5,
        is_walkable: true,
        walkable_difficulty_modifier: 0,
    }
};