var fs = require('fs');

module.exports = (args) => {

    const { shell, folder } = args;

    shell.cd(folder);

    shell.exec(`sh build-js.sh`, { async: true });

    console.info('执行完成');
}