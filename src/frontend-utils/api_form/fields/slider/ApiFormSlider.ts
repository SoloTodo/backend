import { ApiFormApiParams } from "../../types";

export type ApiFormSliderChoice = {
  value: number;
  label: string;
  id?: number;
  count?: number;
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
    const start = query.get(`${this.name}_min`);
    const end = query.get(`${this.name}_max`);

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
      apiParams[`${this.name}_min`] = [this.cleanedData[0].toString()];
    if (this.cleanedData[1] !== null)
      apiParams[`${this.name}_max`] = [this.cleanedData[1].toString()];
    return apiParams;
  }
}
