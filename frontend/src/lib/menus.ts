export const MENU_KINDS = ["signature", "seasonal", "porch"] as const;
export type MenuKind = (typeof MENU_KINDS)[number];

export const MENU_LABELS: Record<MenuKind, string> = {
  signature: "Signature menu",
  seasonal: "Seasonal menu",
  porch: "Porch Pickup",
};

export const MENU_PATHS: Record<MenuKind, string> = {
  signature: "/menu",
  seasonal: "/seasonal",
  porch: "/porch-pickup",
};
