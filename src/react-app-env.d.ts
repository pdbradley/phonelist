/// <reference types="react-scripts" />

declare module "phone-number-formats" {
  declare class PhoneNumberFormatter {
    constructor(value: string);
    format: (options?: {
      type?: "domestic" | "international";
      separator?: string;
      areaCode?: string;
      letters?: boolean;
    }) => {
      toString: () => string;
      convert: () => string;
    };
  }

  export default PhoneNumberFormatter;
}
