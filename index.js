const fs = require('fs');
const core = require('@actions/core');

(async () => {
    try {
        const path = core.getInput('composer_file');
        const debug = core.getInput('debug');

        const data = await fs.promises.readFile(path);
        const composerJson = JSON.parse(data);

        const generateEnvValues = (object, namePrefix) => {
            for (const property in object) {
                if (typeof object[property] === 'object' && object[property] !== null) {
                    generateEnvValues(object[property], namePrefix + property + '_');

                    continue;
                }

                const propertyName = property.replace(/[\/\\]/g, '-');

                if (debug !== '0') {
                    console.log('${{ env.' + namePrefix + propertyName + ' }}');
                }

                core.exportVariable(namePrefix + propertyName, object[property]);
            }
        };

        generateEnvValues(composerJson, 'composer_');
    } catch (error) {
        core.setFailed(error.message);
    }
})();
