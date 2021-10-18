
export function restartProcess(options: RestartOptions): Promise<any> {
    return new Promise(async (resolve: any, reject: any) => {
        let command = window.NL_ARGS.reduce((acc: string, arg: string, index: number) => {
            acc += ' ' + arg;
            return acc;
        }, '');
        
        if(options.args) {
            command += ' ' + options.args;
        }
        
        await Neutralino.os.execCommand(command, {shouldRunInBackground: true});
        Neutralino.app.exit();
        resolve();
    });
};
