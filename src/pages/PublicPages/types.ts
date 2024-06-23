export interface Template {
  id: string;
  title: string;
  description: string;
  image?: string;
  workflowOrderedList?: string[];
  links?: { title: string; url: string }[];
}

export interface BagpipesTemplate extends Template {
  workflowOrderedList?: string[];
  links: { title: string; url: string }[];
}

export interface UITemplate extends Template {
  links: { title: string; url: string }[];
  image: string;
}

export interface Feature {
  feature: string;
  description: string;
}

export interface HowTo {
  title: string;
  image: string;
  description: string;
}

export interface Hashtag {
  backgroundColor: string;
  id: string;
  tag: string;
  color: string;
}

export interface Creator {
  id: string;
  name: string;
  username: string;
  title: string;
  image: string;
  description: string;
  templates: string[]; // Array of Template IDs
}

export interface Community {
  logo: string;
  name: string;
  title: string;
  description: string;
  url: string;
  templates: {
    bagpipes: BagpipesTemplate[];
    ui: UITemplate[];
  };
  howTos: HowTo[];
  features: Feature[];
  hashTags: string[]; 
  mostActiveCreators: string[]; 
}
