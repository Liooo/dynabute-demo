// string 'Z' at the end return by rails api
export function toDatetimeLocalStr(dateStr) {
  return (dateStr[dateStr.length - 1] == 'Z') ? dateStr.slice(0, dateStr.length - 1) : dateStr;
}
