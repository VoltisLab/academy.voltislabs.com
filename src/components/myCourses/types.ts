export type Course = {
  id: number;
  image: string;
  tag: string;
  title: string;
  modules: string;
  progress: number;
  slug?: string;
};

export type Card_type = 'my-courses' | 'explore';