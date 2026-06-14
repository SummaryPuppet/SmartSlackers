// Tipos para las carreras que ya maneja el test (careerKey en useTestLogic)
export type Career =
  | "software"
  | "medicina"
  | "ingenieria"
  | "matematicas"
  | "diseno"
  | "literatura"
  | "musica"
  | "administracion"
  | "psicologia"
  | "derecho"
  | "arquitectura"
  | "astronauta"
  | "gastronomia"
  | "marketing";

export type SkinTone = "light" | "medium-light" | "medium" | "medium-dark" | "dark";
export type HairStyle = "short" | "medium" | "long" | "curly" | "bun" | "braids";
export type HairColor = "black" | "brown" | "blonde" | "red" | "gray" | "white";
export type EyeColor = "brown" | "hazel" | "green" | "blue" | "gray";
export type OutfitBase = "casual" | "formal" | "sporty";
export type Background = "sky" | "library" | "lab" | "city" | "nature" | "abstract";

export interface CareerCosmetic {
  career: Career;
  label: string;
  accessory: string;
  accessoryColor: string;
  hat: string;
  badge: string;
  background: Background;
  accentColor: string;
  description: string;
}

export interface AvatarConfig {
  skinTone: SkinTone;
  hairStyle: HairStyle;
  hairColor: HairColor;
  eyeColor: EyeColor;
  outfitBase: OutfitBase;
  background: Background;
  careerCosmetic?: CareerCosmetic;
  unlockedCareers?: Career[];
  avatarType?: "person" | "dino";
}

export interface SavedAvatar {
  uid: string;
  config: AvatarConfig;
  career: Career | null;
  updatedAt: number;
}
