const electron = require('electron');
const desktopCapturer = electron.desktopCapturer;
const screenElectron = electron.remote.screen;
const shell = electron.shell;

const fs = require('fs');
const os = require('os');
const path = require('path');

const screenshotButton = document.getElementById('screenshot-button');
const screenshotPath = document.getElementById('screenshot-path');

screenshotButton.addEventListener('click', function(event) {
  screenshotPath.textContent = 'Gathering screen...';
  const thumbSize = determineScreenshot();
  let options = {types: ['window', 'screen'], thumbnailSize: thumbSize};

  desktopCapturer.getSources(options).then(async sources => {
    for (const source of sources) {
      if (source.name === 'Entire Screen') {
        const screenShotPath = path.join(os.tmpdir(), 'screenshot.png');
        fs.writeFile(screenShotPath, source.thumbnail.toPNG(), function(error) {
          if (error) return console.log(error.message);
          shell.openExternal('file://' + screenShotPath);
          screenshotPath.textContent = 'Saved screenshot to: ' + screenShotPath;
        });
      }
    }
  });
});

function determineScreenshot() {
  const screenSize = screenElectron.getPrimaryDisplay().workAreaSize;
  const maxDimension = Math.max(screenSize.width, screenSize.height);
  return { 
    width: maxDimension * window.devicePixelRatio,
    height: maxDimension * window.devicePixelRatio,
  }
}