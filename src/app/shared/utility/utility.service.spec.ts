import { TestBed, inject } from "@angular/core/testing";
import { UtilityService } from "./utility.service";
import { TranslateService, TranslateLoader , MissingTranslationHandler} from "ng2-translate";
import { ConfigService } from "../../app-config.service";
import { HttpClient, HttpHandler } from "@angular/common/http";
import { NotificationsService } from "angular2-notifications";

  describe("Testing UtilityService", () => {
    let utyservice: UtilityService;
    let nfService: NotificationsService;
    let cfgService: ConfigService;
    // tslint:disable-next-line:prefer-const
    let trnsService: TranslateService;
    //Not completed.
    beforeEach(() => {
      TestBed.configureTestingModule({
        // tslint:disable-next-line:max-line-length
        providers: [UtilityService, TranslateService, HttpHandler, MissingTranslationHandler, TranslateLoader, HttpClient, ConfigService, NotificationsService]
      });
      nfService = TestBed.get(NotificationsService);
      cfgService = TestBed.get(ConfigService);
      utyservice = new UtilityService(trnsService, nfService, cfgService);
    });

    it("should create an instance of Utility Service", () => {
      expect(utyservice).toBeDefined();
    });

  });
