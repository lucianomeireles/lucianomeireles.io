export type Locale = "en" | "es" | "pt";

export type ContentDictionary = {
  episodeLine: string;
  title: string;
  paragraphs: string[];
  links: {
    email: string;
    linkedin: string;
    github: string;
  };
  contactUrls: {
    email: string;
    linkedin: string;
    github: string;
  };
};
