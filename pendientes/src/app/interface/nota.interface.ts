export interface Note {
  id: string;
  title: string;
  description: string;
  color: string;
  imageUrl?: string;
  completed: boolean; // Nueva propiedad añadida
}
