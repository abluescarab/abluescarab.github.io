# abluescarab.github.io
This is the repository containing my portfolio website. The current portfolio was designed for the final project in Portland State University's Intro to Web Dev class.

Visit the site at [abluescarab.github.io](https://abluescarab.github.io/).

## Compiling
To compile the site, you will need an installation of [Sass](https://sass-lang.com/) and [Node.js](https://nodejs.org/en/). I recommend using VS Code with the [Live Sass Compiler](https://marketplace.visualstudio.com/items?itemName=glenn2223.live-sass) extension.

### Node.js
Install TypeScript globally:
```
npm install -g typescript
```
Then install packages in the project directory:
```
npm install
```

### Build and watch
The `.vscode` folder in this repository contains build and watch tasks that will automatically compile Sass and Typescript when the workspace is opened. If you are not using the Live Sass Compiler extension, remove the `Watch Sass` task. These tasks will run in PowerShell by default; to change this behavior, remove this section for any tasks that have it:
```json
"options": {
  "shell": {
    "executable": "powershell"
  }
}
```
After the Sass and TypeScript files have been compiled, the site can be opened in a browser. *Note: the contact form will not work on a local address, but will work once deployed.*

## Debugging
VS Code can be used to debug the TypeScript files once they are successfully compiled. Place a breakpoint on the line to debug then go to `Run > Start Debugging` at the top of the VS Code window.

## Credits
* [CSS Tricks](https://css-tricks.com/), ["Typewriter Effect"](https://css-tricks.com/snippets/css/typewriter-effect/), ["How to Animate the Details Element Using WAAPI](https://css-tricks.com/how-to-animate-the-details-element-using-waapi/)
* [Matthemattics](https://stackoverflow.com/users/668871/matthemattics), ["Can CSS detect the number of children an element has?"](https://stackoverflow.com/a/12198561/567983)
* [Marta Branco](https://www.pexels.com/@martabranco/), ["Closeup Photo of Black and Blue Keyboard"](https://www.pexels.com/photo/closeup-photo-of-black-and-blue-keyboard-1194713/)
* [Boxicons](https://github.com/atisawd/boxicons?ref=svgrepo.com), C++
* [Blivesta](https://github.com/blivesta/flexicon?ref=svgrepo.com), HTML5
* [Coreui](https://github.com/coreui/coreui-icons/?ref=svgrepo.com), Visual Studio, VS Code, JetBrains, Ionic, LaTeX
* [Diemen Design](https://github.com/DiemenDesign/LibreICONS?ref=svgrepo.com), Microsoft Word, Microsoft PowerPoint
* [Etn Ccis](https://github.com/etn-ccis/blui-icons?ref=svgrepo.com), PowerPoint
* [Grommet](https://github.com/grommet/grommet-icons?ref=svgrepo.com), Zoom
* [Icooon Mono](https://icooon-mono.com/?ref=svgrepo.com), C#
* [Instructure Ui](https://github.com/instructure/instructure-ui?ref=svgrepo.com), Windows
* [Jtblabs](https://github.com/jtblabs/jtb-icons?ref=svgrepo.com), CSS3, Python, JavaScript, GIMP, Inkscape, Blender, Git, Ubuntu
* [Primefaces](https://www.primefaces.org/diamond/icons.xhtml?ref=svgrepo.com), GitHub, LinkedIn, Discord, Slack, YouTube, Google, Facebook, reddit
* [Uxaspects](https://github.com/UXAspects/UXAspects?ref=svgrepo.com), Java
