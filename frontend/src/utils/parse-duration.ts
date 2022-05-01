const durationRE = /(-?(?:\d+\.?\d*|\d*\.?\d+)(?:e[-+]?\d+)?)\s*([\p{L}]*)/uig

/**
 * conversion ratios
 */

const ratioLookup: any = {};

ratioLookup.nanosecond =
ratioLookup.ns = 1 / 1e6

ratioLookup['µs'] =
ratioLookup['μs'] =
ratioLookup.us =
ratioLookup.microsecond = 1 / 1e3

ratioLookup.millisecond =
ratioLookup.ms =
ratioLookup[''] = 1

ratioLookup.second =
ratioLookup.sec =
ratioLookup.s = ratioLookup.ms * 1000

ratioLookup.minute =
ratioLookup.min =
ratioLookup.m = ratioLookup.s * 60

ratioLookup.hour =
ratioLookup.hr =
ratioLookup.h = ratioLookup.m * 60

ratioLookup.day =
ratioLookup.d = ratioLookup.h * 24

ratioLookup.week =
ratioLookup.wk =
ratioLookup.w = ratioLookup.d * 7

ratioLookup.month =
ratioLookup.b =
ratioLookup.d * (365.25 / 12)

ratioLookup.year =
ratioLookup.yr =
ratioLookup.y = ratioLookup.d * 365.25

/**
 * convert `str` to ms
 *
 * @param {String} str
 * @param {String} format
 * @return {Number}
 */

export function parseDuration(str: string, format='ms'): number {
  let result = 0;
  // ignore commas/placeholders
  const parsedStr = str.replace(/(\d)[,_](\d)/g, '$1$2')
  parsedStr.replace(durationRE, function (_, n: string, units: string){
    const ratio = unitRatio(units)
    if (ratio) result = (result || 0) + parseFloat(n) * ratio
    return '';
  })

  return result && (result / (unitRatio(format) || 1))
}

function unitRatio(str: string) {
  return ratioLookup[str] || ratioLookup[str.toLowerCase().replace(/s$/, '')]
}