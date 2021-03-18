const {validators} = require("./validate");

const badFunction = () => {
    const myValidators = validators();
    myValidators.map((validator) => {
        if(!validator.supportedExtensions) {
            validator.supportedExtensions = [];
        }
        // the code didnt do this exactly this is demo
        validator.supportedExtensions.push("WOOPS");
    });
}

let index = 0;

f = setInterval(() => {
    // even though theres no references to myValidators array
    // there is a memory leak with the .push
    badFunction();
    index++;
    console.log(`Running bad code cycle: ${index}`);
    if(index === 20000) {
     //   clearInterval(f);
    }
},10)