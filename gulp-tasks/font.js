const {dest, src} = require('gulp');
const GetGoogleFonts = require('get-google-fonts');

const fonts = async () => {
  // Setup of the library instance by setting where we want
  // the output to go. CSS is relative to output font directory
  const instance = new GetGoogleFonts({
    outputDir: './dist/fonts',
    cssFile: './fonts.css'
  });

  try  {
    // Grabs fonts and CSS from google and puts in the dist folder
    const result = await instance.download(
      // add new weights as needed
      'https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;800&display=swap'
    );
  } catch(e) {
    return  null;
  }
 

};

module.exports = fonts;