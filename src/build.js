const fs = require('fs');
const VERSION = JSON.parse(fs.readFileSync('package.json')).version;

const FORMATS = [
    {
        name: 'Twine to JSON',
        version: VERSION,
        description: 'Convert Twine story to JSON',
        scriptPath: 'src/twinetojson.js',
        templatePath: 'templates/json.html',
        commandString: 'twineToJSON("twine")',
        buildPath: 'dist/twine.js',
    },
    {
        name: 'Harlowe 3 to JSON',
        version: VERSION,
        description: 'Convert Harlowe 3-formatted Twine story to JSON',
        scriptPath: 'src/twinetojson.js',
        templatePath: 'templates/json.html',
        commandString: 'twineToJSON("harlowe-3")',
        buildPath: 'dist/harlowe-3.js',
    },
];


function build() {
    FORMATS.forEach((format) => {
        _buildFormat(format);
    });
}
build();


function _buildFormat({ name, version, description, scriptPath, templatePath, commandString, buildPath }) {
    const source = _generateSource({ scriptPath, templatePath, commandString });
    const format = _generateFormat({ name, version, description, source });
    fs.writeFileSync(buildPath, format, 'utf8');
}


function _generateSource({ scriptPath, templatePath, commandString }) {
    const scriptText = fs.readFileSync(scriptPath, 'utf8').replace(/\\/g, '\\\\');
    const templateText = fs.readFileSync(templatePath, 'utf8');
    const source = templateText.replace('{{SCRIPT}}', scriptText).replace('{{COMMAND}}', commandString);
    return source;
}


function _generateFormat({ name, version, description, source }) {
    return `\
window.storyFormat({
    "name": "${name}",
    "version": "${version}",
    "author": "",
    "description": "${description}",
    "proofing": false,
    "source": \`
${source}\`
});
`
}
