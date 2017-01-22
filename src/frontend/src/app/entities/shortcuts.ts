/**
 * Created by simon41 on 11/30/2016.
 */
export interface Shortcut {
  id: number;
  description: string;
  descriptionShort: string;
  keyCode: string;
  ratingCount: number;
  ratingNr: number;
  programVersion: string; //Url of the associated Version Entity
  //_links:{}; links to foreign keys
}
