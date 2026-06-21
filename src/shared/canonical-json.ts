export type JsonPrimitive = null | boolean | number | string;
export type JsonValue = JsonPrimitive | readonly JsonValue[] | { readonly [key: string]: JsonValue };

function serializeString(value: string): string {
  for (let index = 0; index < value.length; index += 1) {
    const codeUnit = value.charCodeAt(index);
    if (codeUnit >= 0xd800 && codeUnit <= 0xdbff) {
      const next = value.charCodeAt(index + 1);
      if (!(next >= 0xdc00 && next <= 0xdfff)) {
        throw new TypeError("Canonical JSON does not support lone surrogates.");
      }
      index += 1;
    } else if (codeUnit >= 0xdc00 && codeUnit <= 0xdfff) {
      throw new TypeError("Canonical JSON does not support lone surrogates.");
    }
  }
  return JSON.stringify(value);
}

function serializeNumber(value: number): string {
  if (!Number.isFinite(value)) {
    throw new TypeError("Canonical JSON does not support non-finite numbers.");
  }
  return Object.is(value, -0) ? "0" : JSON.stringify(value);
}

export function canonicalJson(value: JsonValue): string {
  const ancestors = new Set<object>();

  const serialize = (current: JsonValue): string => {
    if (current === null) return "null";
    if (typeof current === "string") return serializeString(current);
    if (typeof current === "number") return serializeNumber(current);
    if (typeof current === "boolean") return current ? "true" : "false";

    if (ancestors.has(current)) {
      throw new TypeError("Canonical JSON does not support circular values.");
    }
    ancestors.add(current);

    let result: string;
    if (Array.isArray(current)) {
      for (let index = 0; index < current.length; index += 1) {
        if (!(index in current)) {
          throw new TypeError("Canonical JSON does not support sparse arrays.");
        }
      }
      result = `[${current.map((item) => serialize(item)).join(",")}]`;
    } else {
      const prototype = Object.getPrototypeOf(current);
      if (prototype !== Object.prototype && prototype !== null) {
        throw new TypeError("Canonical JSON objects must be plain objects.");
      }
      const object = current as Readonly<Record<string, JsonValue>>;
      const entries = Object.keys(object)
        .sort()
        .map((key) => `${serializeString(key)}:${serialize(object[key] as JsonValue)}`);
      result = `{${entries.join(",")}}`;
    }

    ancestors.delete(current);
    return result;
  };

  return serialize(value);
}

export const canonicalJsonStringify = canonicalJson;
