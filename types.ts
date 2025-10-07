
export interface Visualization {
  type: 'bar' | 'pie' | 'line' | 'table';
  title: string;
  data: any[];
  columns: { key: string; label: string }[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
  visualization?: Visualization;
}

export type DataObject = {
  [key: string]: string | number;
};