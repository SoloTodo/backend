import numeral from 'numeral';
import {Currency} from "../frontend-utils/redux/api_resources/types";
import currencyjs from 'currency.js'

// ----------------------------------------------------------------------

export function fCurrency(number: string | number) {
    return numeral(number).format(Number.isInteger(number) ? '$0,0' : '$0,0.00');
}

export function fPercent(number: number) {
    return numeral(number / 100).format('0.0%');
}

export function fNumber(number: string | number) {
    return numeral(number).format();
}

export function fShortenNumber(number: string | number) {
    return numeral(number).format('0.00a').replace('.00', '');
}

export function fData(number: string | number) {
    return numeral(number).format('0.0 b');
}

export function formatCurrency(currency: Currency, number: number | string) {
    return currencyjs(number, {symbol: currency.prefix, precision: currency.decimal_places, separator: '.'}).format()
}