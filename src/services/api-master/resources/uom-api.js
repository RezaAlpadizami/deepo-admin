import RequestHandler from '../request-handler';
import ENDPOINT from '../../../config/api-master';

class UomApi extends RequestHandler {
  constructor() {
    super(ENDPOINT.UOM);
  }
}

export default new UomApi();
