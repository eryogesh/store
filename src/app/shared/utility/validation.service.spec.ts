import { TestBed, inject } from "@angular/core/testing";
import { ValidationService } from "./validation.service";
import { FormControl, FormGroup } from "@angular/forms";

describe("Testing Validation Service,", () => {
  let vService: ValidationService;
  let frmContrl;

  beforeEach(() => {
    vService = new ValidationService();
    frmContrl = new FormControl();
  });

  it("1. should create an instance, the object should not be undefined", () => {
    expect(vService).toBeDefined();
  });

  it("2. validateEmail(FormControl), should return an object with valid flag as false in case of invalid mail id", () => {
    frmContrl.setValue("sherin.luka$capgemini.com");
    const valObj = { validateEmail: { valid: false } };
    expect(vService.validateEmail(frmContrl)).toEqual(valObj);
  });

  it("3. validateEmail(FormControl), should return null in case of valid mail id", () => {
    frmContrl.setValue("sherin.luka@capgemini.com");
    expect(vService.validateEmail(frmContrl)).toBeNull();
  });

  it("4. numericRequired(FormControl), should return an object with valid flag as false in case of invalid number", () => {
    frmContrl.setValue("");
    const valObj = { numericRequired: { valid: false } };
    expect(vService.numericRequired(frmContrl)).toEqual(valObj);
  });

  it("5. numericRequired(FormControl), should return null in case of valid number", () => {
    frmContrl.setValue(100);
    expect(vService.numericRequired(frmContrl)).toBeNull();
  });

  it("6. matchingPasswords(String,String), should return an object with valid flag as false in case of password mismatch", () => {
    const valObj = {"mismatch": { "valid": false } };
    expect(vService.matchingPasswords("one", "two"));
  });

  it("7. matchingPasswords(String,String), should return null in case of valid number", () => {
    expect(vService.matchingPasswords("one", "one"));
  });
});
