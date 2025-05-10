export function copyProperties<T>(source: any, propsArray: string[]): Pick<typeof source, keyof T> {
  const result: Partial<Record<keyof T, any>> = {};

  for (const key of propsArray as (keyof T)[]) {
    result[key] = source[key];
  }

  return result as Pick<typeof source, keyof T>;
}

/**
 * Converts to Plain Javascript Object for serialization.
 * @param {any} obj - The object to convert
 */
export function serializable(obj: any) {
  return Object.assign({}, obj);
}
export function jsonSerializable(obj: any) {
  return JSON.parse(JSON.stringify(obj));
}
export function formatEnum(str: string, delimiter: string, replacement: string) {
  if (!str) return str;
  // replace all occurrences of the delimiter with the replacement string
  str = str.replace(new RegExp(delimiter, "g"), replacement);

  // remove dashes from the string
  str = str.replace(/-/g, " ");
  // remove multiple spaces
  str = str.replace(/\s+/g, " ");
  // remove leading and trailing spaces
  str = str.trim();
  // capitalize first letter of each word
  str = str.replace(/\b\w/g, function (l) {
    return l.toUpperCase();
  });
  return str;
}

export function capitalizeWords(str: string) {
  // capitalize first letter of each word
  str = str.replace(/\b\w/g, function (l) {
    return l.toUpperCase();
  });
}
export function formatReplace(str: string, ...args: any[]) {
  if (!str) return str;
  for (var i = 0; i < args.length; i++) {
    str = str.replace(/%s/, args[i]);
  }
  return str;
}

export function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
/**
 * Formats a PascalCase or camelCase string into a human-readable format with spaces.
 * @param {string} str - The input string in PascalCase or camelCase.
 * @returns {string} - The formatted string with spaces and proper capitalization.
 */
export function formatToReadableString(str: string): string {
  if (!str) return "";

  // Insert spaces before uppercase letters
  const formatted = str.replace(/([a-z])([A-Z])/g, "$1 $2");

  // Capitalize the first letter if the string is camelCase
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}
/**
 * Formats a number into a price string.
 * @param {number} amount - The number to format.
 * @param {string} currency - The currency code (e.g., "USD", "EUR").
 * @param {string} locale - The locale for formatting (e.g., "en-US", "de-DE").
 * @returns {string} - The formatted price string.
 */
export function formatPrice(amount: number, currency: string = "USD", locale: string = "en-US"): string {
  if (isNaN(amount)) return "Invalid amount";

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(amount);
}

export function stringToColor(str: string) {
  if (!str) return "#000000";
  let hash = 0;
  let i;
  /* eslint-disable no-bitwise */
  for (i = 0; i < str.length; i += 1) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = "#";
  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */
  return color;
}

export function stringAvatar(name: string) {
  if (!name) return {};
  var split = name.split(" ");
  if (split.length <= 1) {
    return {
      sx: {
        bgcolor: stringToColor(name)
      },
      children: name[0]
    };
  }
  return {
    sx: {
      bgcolor: stringToColor(name)
    },
    children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`
  };
}

export function hasTrailingSlash(url: string | undefined) {
  if (!url) return false;
  return url[url.length - 1] == "/";
}

export function addPath(baseUrl: string | undefined, path: string) {
  var hasSlash = hasTrailingSlash(baseUrl);
  if (hasSlash && path[0] == "/") {
    path = path.substring(1);
  } else if (!hasSlash && path[0] != "/") {
    path = "/" + path;
  }
  return baseUrl + path;
}

export const GetBoolParam = (param: string | null) => {
  return Boolean((param || "").replace(/\s*(false|null|undefined|0)\s*/i, ""));
};

/**
 * Shallow comparison of sets for equality
 * @param a Set to compare
 * @param b Set to compare
 */
export function isSetEq(a: Set<any>, b: Set<any>) {
  if (a.size !== b.size) return false;
  for (var x of a) if (!b.has(x)) return false;

  return true;
}

/**
 * Logs to console if in development mode
 * @param args parameters passed to `console.log`
 */
export function verbose(...args: any[]) {
  if (process.env.NODE_ENV === "development") {
    console.log(...args);
  }
}

export function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`
  };
}

/**
 * Shallow copy properties from the source object to the target object.
 * @param {any} Target - The target object to copy properties to.
 * @param {any} Source - The source object to copy properties from.
 * @param {boolean} copyObjects - A boolean value indicating whether to copy object properties as well. Defaults to false.
 */
export function ShallowCopy(
  Target: any,
  Source: any,
  copyObjects: boolean = false
) {
  if (!Source) return;
  return Object.keys(Target).forEach((key) => {
    if (
      Source[key] !== undefined &&
      (copyObjects || typeof Source[key] !== "object")
    )
      Target[key] = Source[key];
  });
}
/**
 * Recursively copy properties from the source object to the target object, only including properties that exist in the target object.
 * Sub objects are copied recursively as well.
 * @param {any} Target - The target object to copy properties to.
 * @param {any} Source - The source object to copy properties from.
 * @param {boolean} copyObjects - A boolean value indicating whether to copy object properties as well. Defaults to false.
 */
export function DeepRecursiveCopy(
  Target: any,
  Source: any,
  copyObjects: boolean = false
) {
  if (!Source) return;
  return Object.keys(Target).forEach((key) => {
    if (Source[key] !== undefined) {
      if (copyObjects || typeof Source[key] !== "object") {
        if (
          typeof Target[key] === "object" &&
          Target[key] !== null &&
          typeof Source[key] === "object" &&
          Source[key] !== null &&
          Source[key].constructor === Target[key].constructor
        ) {
          DeepRecursiveCopy(Target[key], Source[key], copyObjects);
        } else {
          Target[key] = Source[key];
        }
      }
    }
  });
}
export function formatViewCount(viewCount: number) {
  if (viewCount < 1000) {
    return viewCount.toString();
  } else if (viewCount < 1000000) {
    return `${(viewCount / 1000).toFixed(1)}K`;
  } else {
    return `${(viewCount / 1000000).toFixed(1)}M`;
  }
}
export function formatFileSizeString(sizeInBytes: string, bytes: boolean = false) {
  if (!sizeInBytes) return "0 B";
  const size = parseInt(sizeInBytes, 10);
  if (isNaN(size)) return "0 B";
  return formatFileSize(size, bytes);
}
export function formatFileSize(sizeInBytes: number, bytes: boolean = false) {
  if (sizeInBytes === 0) {
    return "0 B";
  }
  const k = bytes ? 1024 : 1000;
  const units = ["B", "KB", "MB", "GB", "TB"];
  const decimalPlaces = 2;
  const size = Math.floor(Math.log(sizeInBytes) / Math.log(k));
  const formattedSize = (sizeInBytes / Math.pow(k, size)).toFixed(
    decimalPlaces
  );

  return `${formattedSize} ${units[size]}`;
}

export function maxText(fullText: string, maxCharacters: number) {
  if (fullText.length <= maxCharacters) return fullText;

  // Find the last complete word before the maximum cutoff
  const lastSpaceIndex = fullText.lastIndexOf(" ", maxCharacters);
  const truncatedText = fullText.substring(0, lastSpaceIndex) + "...";

  return truncatedText;
}
// calculateOtherFromAspectRatio(16, 9, 1920) = 1080
// calculateOtherFromAspectRatio(16, 9, 0, 1080) = 1920
export function calculateOtherFromAspectRatio(
  xScale: number,
  yScale: number,
  x?: number,
  y?: number
) {
  if (x && !y) {
    return (x * yScale) / xScale;
  }
  if (y && !x) {
    return (y * xScale) / yScale;
  }
  return 0;
}

export function isNullOrEmpty(str: string | null | undefined): boolean {
  return str === null || str === undefined || str.trim() === "";
}
const validProtocols = [
  "http:",
  "https:",
  "viber:",
  "tg:",
  "whatsapp:",
  "mailto:",
  "tel:",
  "sms:",
  "geo:",
  "maps:",
  "fb-messenger:",
  "skype:",
  "zoom:",
  "facetime:",
  "wechat:"
];

export function urlHasValidProtocol(value: string) {
  let url;
  try {
    url = new URL(value);
  } catch (err) {
    // Invalid URL; maybe there is no protocol, or it is relative, or any of the many other possible reasons
    return false;
  }

  // Check whether the protocol is http or https, and reject otherwise
  return validProtocols.includes(url.protocol);
}
export function urlHasTLD(value: string) {
  let url;
  try {
    url = new URL(value);
    if (url.origin.split(".").length === 1) {
      return false;
    }
    return true;
  } catch (err) {
    // Invalid URL
    return false;
  }
}

export function isValidUrl(urlString: string | null | undefined) {
  if (!urlString || isNullOrEmpty(urlString)) return false;
  let url;
  try {
    url = new URL(urlString);
    return true;
  } catch (e) {
    //console.log(e);
    return false;
  }
}
const protocolRegex = /^[a-zA-Z]+:\/\//;
export function getValidUrl(urlString: string): string {
  //console.log(`Validate ${urlString}`);
  if (!urlString || isNullOrEmpty(urlString)) return urlString;
  if (!isValidUrl(urlString)) {
    if (isValidUrl("https://" + urlString)) {
      let url = new URL("https://" + urlString);
      if (url.origin.split(".").length > 1) {
        return "https://" + urlString;
      }
    }
    return urlString;
  }
  let hasProtocol = protocolRegex.test(urlString);
  let url = new URL(urlString);
  //console.log(`${urlString} protocol: ${hasProtocol} ${url.protocol}`);
  // if invalid protocol, remove it
  if (hasProtocol && !validProtocols.includes(url.protocol)) {
    return url.host + url.pathname + url.search + url.hash;
  }
  if (!hasProtocol) {
    //console.log('no protocol', urlString);
    // has tld
    try {
      const httpsUrl = `https://${urlString}`;
      const url = new URL(httpsUrl);
      if (url.origin.split(".").length > 1) {
        return httpsUrl;
      }
    } catch (e) {
      return urlString;
    }
  }

  return urlString;
}
export function isValidURLWithProtocol(url: string | null | undefined) {
  if (url?.startsWith("http://") || url?.startsWith("https://")) {
    return isValidUrl(url);
  } else {
    return isValidUrl("https://" + url);
  }
}
export function formatExternalUrl(url: string | null | undefined) {
  if (!url || isNullOrEmpty(url)) return "";
  if (!isValidURLWithProtocol(url)) return "https://" + url;

  return url;
}

export function isValidURLWithOrWithoutProtocol(
  url: string | null | undefined
) {
  if (!url || isNullOrEmpty(url)) return false;
  const pattern = /^(ftp|http|https):\/\/[^ "]+$/;
  const pattern2 = /^[^ "]+$/;
  return pattern.test(url) || pattern2.test(url);
}

export function isValidEmail(email: string | null | undefined) {
  if (!email || isNullOrEmpty(email)) return false;
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(email);
}

export function isValidDate(date: string | null | undefined) {
  if (!date || isNullOrEmpty(date)) return false;
  const pattern = /^\d{4}-\d{2}-\d{2}$/;
  return pattern.test(date);
}

export function isValidTime(time: string | null | undefined) {
  if (!time || isNullOrEmpty(time)) return false;
  const pattern = /^\d{2}:\d{2}$/;
  return pattern.test(time);
}

export function isValidDateTime(dateTime: string | null | undefined) {
  if (!dateTime || isNullOrEmpty(dateTime)) return false;
  const pattern = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/;
  return pattern.test(dateTime);
}

export function isValidPassword(password: string | null | undefined) {
  if (!password || isNullOrEmpty(password)) return false;
  const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
  return pattern.test(password);
}

export function isValidUsername(username: string | null | undefined) {
  if (!username || isNullOrEmpty(username)) return false;
  const pattern = /^[a-zA-Z0-9]+$/;
  return pattern.test(username);
}

export function isValidName(name: string | null | undefined) {
  if (!name || isNullOrEmpty(name)) return false;
  const pattern = /^[a-zA-Z]+$/;
  return pattern.test(name);
}

export function isValidNumber(number: string | null | undefined) {
  if (!number || isNullOrEmpty(number)) return false;
  const pattern = /^\d+$/;
  return pattern.test(number);
}

export function isValidDecimal(decimal: string | null | undefined) {
  if (!decimal || isNullOrEmpty(decimal)) return false;
  const pattern = /^\d+(\.\d+)?$/;
  return pattern.test(decimal);
}

export function isValidInteger(integer: string | null | undefined) {
  if (!integer || isNullOrEmpty(integer)) return false;
  const pattern = /^\d+$/;
  return pattern.test(integer);
}

export function isValidBoolean(bool: string | null | undefined) {
  if (!bool || isNullOrEmpty(bool)) return false;
  return bool.toLowerCase() === "true" || bool.toLowerCase() === "false";
}

export function isValidJSON(json: string | null | undefined) {
  if (!json || isNullOrEmpty(json)) return false;
  try {
    JSON.parse(json);
    return true;
  } catch (e) {
    return false;
  }
}

type FlatMapValue = string | number | boolean | null | undefined;
type NestedObject = {
  [key: string]:
    | FlatMapValue
    | NestedObject
    | Array<NestedObject | FlatMapValue>;
};

/**
 * Converts a nested object into a flat map where nested keys are joined with dots
 * @example
 * const nested = { a: { b: 1, c: { d: 2 } } };
 * toFlatMap(nested) // { 'a.b': 1, 'a.c.d': 2 }
 */
export const toFlatMap = (
  obj: NestedObject,
  parentKey: string = "",
  result: Record<string, FlatMapValue> = {}
): Record<string, FlatMapValue> => {
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];
      const newKey = parentKey ? `${parentKey}.${key}` : key;

      if (value === null || value === undefined) {
        result[newKey] = value as FlatMapValue;
      } else if (typeof value !== "object") {
        result[newKey] = value as FlatMapValue;
      } else if (Array.isArray(value)) {
        value.forEach((item, index) => {
          if (typeof item === "object" && item !== null) {
            toFlatMap(item as NestedObject, `${newKey}[${index}]`, result);
          } else {
            result[`${newKey}[${index}]`] = item as FlatMapValue;
          }
        });
      } else {
        toFlatMap(value as NestedObject, newKey, result);
      }
    }
  }
  return result;
};
