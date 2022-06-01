import { ApiFormApiParams } from "../../types";

export type ApiFormSliderChoice = {
  value: number;
  label: string;
  id?: number;
};

export type ApiFormSliderProps = {
  fieldType: "slider";
  name: string;
  choices: ApiFormSliderChoice[];
  step: string | null;
  unit: string | null;
  discrete?: boolean;
};

export class ApiFormSlider {
  readonly name: string;
  readonly choices: ApiFormSliderChoice[];
  readonly discrete: boolean;
  readonly step: number | null;
  readonly unit: string | null;
  cleanedData?: [number | null, number | null];

  constructor(
    name: string,
    choices: ApiFormSliderChoice[],
    step: string | null,
    unit: string | null,
    discrete?: boolean,
    cleanedData?: [number | null, number | null]
  ) {
    this.name = name;
    this.choices = choices;
    this.step = Number(step);
    this.unit = unit;
    this.discrete = discrete || false;
    this.cleanedData = cleanedData;
  }

  loadData(query: URLSearchParams) {
    const start = query.get(`${this.name}_start`);
    const end = query.get(`${this.name}_end`);

    const valueStart = start === null ? null : Number(start);
    const valueEnd = end === null ? null : Number(end);

    this.cleanedData = [valueStart, valueEnd];
  }

  isValid() {
    return typeof this.cleanedData !== "undefined";
  }

  getApiParams(): ApiFormApiParams {
    if (typeof this.cleanedData === "undefined") {
      throw new Error("Invalid call on invalid field");
    }

    const apiParams: ApiFormApiParams = {};
    if (this.cleanedData[0] !== null)
      apiParams[`${this.name}_start`] = [this.cleanedData[0].toString()];
    if (this.cleanedData[1] !== null)
      apiParams[`${this.name}_end`] = [this.cleanedData[1].toString()];
    return apiParams;
  }
}
