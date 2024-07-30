import ConfigManager from "@/config/config";

class LoggerUtil {

    prefix = '%c[Logger]';
    style = ('style');

    constructor(prefix: string, style: string) {
        this.prefix = prefix;
        this.style = style;
    }

    log(p0: string) {
        console.log(this.prefix, this.style, p0);
    }

    info(p0: string) {
        console.info(this.prefix, this.style, p0);
    }
    
    warn(p0: string) {
        console.warn(this.prefix, this.style, p0);
    }

    debug(p0: string) {
        if (new ConfigManager().get('debug')) {
            console.debug(this.prefix, this.style, p0);
        }
    }

    error(p0: string) {
        console.error(this.prefix, this.style, p0);
    }
}

export default function createLogger(prefix: string, style: string) {
    return new LoggerUtil(prefix, style);
}
