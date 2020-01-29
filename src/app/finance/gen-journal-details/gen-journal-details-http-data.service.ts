import { Injectable } from '@angular/core';
import { DataService } from '../../data.service';
import UtilsForGlobalData from '../../Utility/UtilsForGlobalData';

@Injectable({
  providedIn: 'root'
})

/**
  * @author Ganesh
  * On 08-08-2019
  * sends the POST request
  */


export class GenJournalDetailsHttpDataService {

  constructor(private dataFromService: DataService) { }

  getCOA(parameter): any {
    return this.dataFromService.getServerData("GenJournalCard", "getCOA", parameter)
      .map(dataCOA => {
        return dataCOA;
      });
  }

  getCompanyInfo(): any {
    return this.dataFromService.getServerData("company", "getCompanyInfo", ['',
      UtilsForGlobalData.getCompanyName()])
      .map(getCompany => {
        return getCompany;
      });
  }

  getHeader(parameter): any {
    return this.dataFromService.getServerData("GenJournalCard", "getHeader", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  getLines(parameter): any {
    return this.dataFromService.getServerData("GenJournalCard", "getLines", parameter)
      .map(dataLines => {
        return dataLines;
      });
  }

  btnDeleteLine_clickHandler(parameter): any {
    return this.dataFromService.getServerData("GenJournalCard", "btnDeleteLine_clickHandler", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  addGenJournalLine(parameter): any {
    return this.dataFromService.getServerData("GenJournalCard", "addGenJournalLine", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  updateGenJournalLine(parameter): any {
    return this.dataFromService.getServerData("GenJournalCard", "updateGenJournalLine", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  getTotalAmounts(parameter): any {
    return this.dataFromService.getServerData("GenJournalCard", "getTotalAmounts", parameter)
      .map(dataTotal => {
        return dataTotal;
      });
  }

  checkFiscalYear(parameter): any {
    return this.dataFromService.getServerData("GenJournalCard", "checkFiscalYear", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  postJournal(parameter): any {
    return this.dataFromService.getServerData("GenJournalCard", "postJournal", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  deleteAllLines(parameter): any {
    return this.dataFromService.getServerData("GenJournalCard", "deleteAllLines", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  btnSAVE_clickHandler(parameter): any {
    return this.dataFromService.getServerData("CreateGLTemplate", "btnSAVE_clickHandler", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  getList(parameter): any {
    return this.dataFromService.getServerData("GenJouTemplateLookUp", "getList", parameter)
      .map(datagetList => {
        return datagetList;
      });
  }

  recList_itemClickHandler(parameter): any {
    return this.dataFromService.getServerData("GenJouTemplateLookUp", "recList_itemClickHandler", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  handleTemplateLookUp(parameter): any {
    return this.dataFromService.getServerData("GenJournalCard", "handleTemplateLookUp", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  getHeaderList(parameter): any {
    return this.dataFromService.getServerData("TrackingDocumentLines", "getHeaderList", parameter)
      .map(datagetList => {
        return datagetList;
      });
  }

  getDocumentTrackingList(parameter): any {
    return this.dataFromService.getServerData("TrackingDocumentLines", "getDocumentTrackingList", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  TrackingDocumentgetLines(parameter): any {
    return this.dataFromService.getServerData("TrackingDocumentLines", "getLines", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  btnAdd_clickHandler(parameter): any {
    return this.dataFromService.getServerData("TrackingDocumentLines","btnAdd_clickHandler", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  addTrackingLine(parameter): any {
    return this.dataFromService.getServerData("TrackingDocumentLines","addTrackingLine", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  button1_clickHandler(parameter): any {
    return this.dataFromService.getServerData("TrackingDocumentLines","button1_clickHandler", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }


}
