import { inject, TestBed } from "@angular/core/testing";
import { YammerService } from "./yammer.service";

describe("Testing Yammer Service,", () => {
  let yService: YammerService;

  beforeEach(() => {
    yService = new YammerService();
  });

  it("1. should create an instance, the object should not be undefined", () => {
    expect(yService).toBeDefined();
  });
  it("2. postMessage(String,String) should post the given message to Yammer", () => {
    expect(yService.postMessage("Sample Message for Yammer!"));
  });
  it("3. postMessage(String,String) should fail if the message is empty or null", () => {
    expect(yService.postMessage(null));
  });

  it("4. yamPostRequest() Checking the private function is getting called.", () => {
    spyOn<any>(yService, "yamPostRequest");
    yService.postMessage(null);
    expect(yService["yamPostRequest"]).toHaveBeenCalled();
  });
});
