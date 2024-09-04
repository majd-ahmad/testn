export function enumToArray<T>(enumObj: T): Array<string | number> {
    const enumValues: string[] = [];
    for (const key in enumObj) {
        if (enumObj.hasOwnProperty(key)) {
            enumValues.push((enumObj as any)[key]);
        }
    }
    return enumValues;

}