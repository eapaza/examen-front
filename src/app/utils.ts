export default class Utils {
    static toISODate (fecha: Date) : string {
        //console.log(`estoy en utils ${fecha}`);
        let tzoffset = (fecha).getTimezoneOffset() * 60000;
        //console.log(`tzoffset ${tzoffset}`);
        let res = new Date(fecha.getTime() - tzoffset);
        //console.log(`res ${res}`);
        let localISOTime: string = (res).toISOString();
        //console.log(`Salgo de utils ${localISOTime}`);
        return localISOTime;
      }
}