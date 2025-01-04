import { LocationIRL } from "./locationirl";

export interface Place {
    name: string;
    description: string;
    imageBase64: string;
    date: string;
    localization: LocationIRL;
  }