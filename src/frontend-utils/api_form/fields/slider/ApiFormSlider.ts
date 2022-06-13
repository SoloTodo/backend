import { ApiFormApiParams } from "../../types";

export type ApiFormSliderChoice = {
  index: number;
  value: number;
  label: string;
  count?: number;
};

type ApiFormSliderBaseProps = {
  fieldType: "slider";
  name: string;
};

type ApiFormSliderDiscreteProps = {
  choices: ApiFormSliderChoice[];
  step: null;
  unit: null;
};

type ApiFormSliderContinuousProps = {
  choices: [];
  step: string;
  unit: string;
};

export type ApiFormSliderProps = ApiFormSliderBaseProps &
  (ApiFormSliderDiscreteProps | ApiFormSliderContinuousProps);

export class ApiFormSlider {
  readonly name: string;
  readonly choices: ApiFormSliderChoice[];
  readonly step: string | null;
  readonly unit: string | null;
  cleanedData?: [number | null, number | null];

  constructor(
    name: string,
    choices: ApiFormSliderChoice[],
    step: string | null,
    unit: string | null,
    cleanedData?: [number | null, number | null]
  ) {
    this.name = name;
    this.choices = choices;
    this.step = step;
    this.unit = unit;
    this.cleanedData = cleanedData;
  }

  loadData(query: URLSearchParams) {
    const start = query.get(`${this.name}_min`);
    const end = query.get(`${this.name}_max`);

    if (this.step === null) {
      const choiceStart = this.choices.filter((c) => c.value === Number(start));
      const valueStart = choiceStart.length !== 0 ? choiceStart[0].value : null;
      const choiceEnd = this.choices.filter((c) => c.value === Number(end));
      const valueEnd = choiceEnd.length !== 0 ? choiceEnd[0].value : null;
      this.cleanedData = [valueStart, valueEnd];
    } else {
      const valueStart = start === null ? null : Number(start);
      const valueEnd = end === null ? null : Number(end);
      this.cleanedData = [valueStart, valueEnd];
    }
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
