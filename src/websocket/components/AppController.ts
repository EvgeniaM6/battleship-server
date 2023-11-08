import { ClientReqServerResp, DataRequest, RegDataReq, ReqRespTypes } from '../models';
import { UsersManager } from './UsersManager';

export class AppController {
  private usersManager = new UsersManager();

  public getResponseData(dataJson: string): string[] {
    const dataReqObj: ClientReqServerResp = JSON.parse(dataJson);

    const { type, data } = dataReqObj;

    const dataObj: DataRequest = data === '' ? data : JSON.parse(data);

    switch (type) {
      case ReqRespTypes.Reg:
        return this.userRegistration(dataObj as RegDataReq);
      default:
        return [dataJson];
    }
  }

  private userRegistration(dataReqObj: RegDataReq) {
    const dataRespJson: string = this.usersManager.userRegistration(dataReqObj);

    const respObj: ClientReqServerResp = {
      type: ReqRespTypes.Reg,
      data: dataRespJson,
      id: 0,
    };

    const respJson: string = JSON.stringify(respObj);
    return [respJson];
  }
}
