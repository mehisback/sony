// Sidebar route metadata
export interface RouteInfo {
  id:string;
  path: string;
  title: string;
  icon: string;
  icon2: string;
  class: string;
  label:string;
  bgcolor: string;
  labelClass: string;
  extralink: boolean;
  submenu: RouteInfo[];
  pid: string;
  
  /*canActivate:any;
  data:any;*/
}
