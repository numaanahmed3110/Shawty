export interface Url {
  shortLink: string;
  originalLink: string;
  clicks: number;
  status: "active" | "inactive";
  date: Date;
}
