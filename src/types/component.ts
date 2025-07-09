export interface ComponentData {
  id: string;
  name: string;
  type: string;
  content?: string | null;
  position: number;
  paneId?: string | null;
  panePosition?: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ComponentRow {
  id: string;
  components: ComponentData[];
}

export interface PaneType {
  id: string;
  components: ComponentData[];
}

export interface CreateComponentInput {
  name: string;
  type: string;
  content?: string;
}

export interface ReorderComponentsInput {
  components: Array<{
    id: string;
    position: number;
    paneId?: string | null;
    panePosition?: number | null;
  }>;
}

export const COMPONENT_TYPES = {
  HEADER: 'header',
  MCQ: 'mcq',
  BUTTON: 'button',
  IDENTITY: 'identity',
  DROPDOWN: 'dropdown',
  TEXT: 'text',
  DISCLAIMER: 'disclaimer',
  GRAPHIC: 'graphic',
  SHORT_TEXT: 'short_text',
  INPUT: 'input',
  IMAGE: 'image',
  CARD: 'card',
  NAVIGATION: 'navigation',
  MODAL: 'modal',
  TABLE: 'table',
  FOOTER: 'footer'
} as const;

export type ComponentType = typeof COMPONENT_TYPES[keyof typeof COMPONENT_TYPES];