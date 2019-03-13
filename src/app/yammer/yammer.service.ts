import { Injectable } from '@angular/core';

declare var yam: any;

/**
 * Service to work with Yammer.
 * This service is dependent on following script -
 * <script type="text/javascript" data-app-id="toidjJulCZYFbl3MQcWwQ" src="https://assets.yammer.com/assets/platform_js_sdk.js"></script>
 */
@Injectable()
export class YammerService {

  constructor() { }

  postMessage(message: string, groupId: string = '15020809') {
    this.yamPostRequest(this, groupId, message);
  }


  private yamPostRequest(val, groupId: string, message: string) {
    if (groupId && message) {
      yam.platform.request(
        {
          url: 'https://api.yammer.com/api/v1/messages.json'
          , headers: { 'Authorization': 'Bearer 2102-llUbmEkjMS9OFrcplS4yKQ' }
          , method: 'POST'
          , data: {
            'body': message
            , 'group_id': groupId
          }
          , success: function (msg) { console.log('Post was Successful!'); }
          , error: function (msg) { console.log('Post was Unsuccessful'); }
        }
      );
    }


  }

}
