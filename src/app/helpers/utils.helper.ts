export class UtilsHelper {

    public static utcOffsetString(seconds: number) {

        const date = new Date(0);

        date.setSeconds(Math.abs(seconds));

        const time = date.toISOString().slice(11, 16);

        const str = seconds < 0 ? 'UTC-' + time : 'UTC+' + time;

        return str;

    }

    public static base64toBlob(dataURL: string) {

        const type = dataURL.split(';')[0].substr(5);

        const base64result = dataURL.substr(dataURL.indexOf(',') + 1);

        const byteString = window.atob(base64result);

        const arrayBuffer = new ArrayBuffer(byteString.length);

        const int8Array = new Uint8Array(arrayBuffer);

        for (let i = 0; i < byteString.length; i++) {
            int8Array[i] = byteString.charCodeAt(i);
        }

        const blob = new Blob([int8Array], { type: type });

        return blob;

    }

    public static validateEmail(email: string) {

        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
            return true;
        }

        return false;
        
    }
    
}