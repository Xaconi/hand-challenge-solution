// Imports
const process = require( 'process' );
const fs = require('fs');

// Helpers
let errorDetected = false;
let inputCharacters = [];
let inputCharactersPointer = 0;
let memoryInfo = [0];
let memoryPointer = 0;
let nestedLoopIndex = 0;

// Constants
const CHAR_LIMIT = 255;

// Read input
const inputFile = process.argv.find(argument => argument.startsWith( `--input=` ));
const inputFileValue = inputFile.replace(`--input=` , '');

// Actions
const actions = {
    '👉': () => moveMemoryPointerNextCell(),
    '👈': () => moveMemoryPointerPreviousCell(),
    '👆': () => increaseMemoryInfoValue(),
    '👇': () => decreaseMemoryInfoValue(),
    '👊': () => showMemoryInfoValue(),
    '🤛': () => jumpToHandPunchRight(),
    '🤜': () => jumpToHandPunchLeft()
}

fs.readFile(inputFileValue, 'utf8' , (err, data) => {
    if (err) {
      console.error(err)
      errorDetected = true;
      return
    }
    inputCharacters = combineCharsByTwo(data);
    // Loop over input's instructions
    while(inputCharactersPointer < inputCharacters.length) {
        const char = inputCharacters[inputCharactersPointer];
        actions[char]();
    }
});

// @TODO - try/catch error handling

function combineCharsByTwo(text) {
    let resultChars = [];
    let customIndex = 0;
    let pointerIndex = 0;
    while(customIndex < text.length) {
        resultChars[pointerIndex] = `${text[customIndex]}${text[customIndex+1]}`;
        customIndex += 2;
        pointerIndex += 1;
    }
    return resultChars;
}

function moveMemoryPointerNextCell() {
    memoryPointer += 1;
    if(typeof memoryInfo[memoryPointer] == 'undefined')
        memoryInfo[memoryPointer] = 0;
    inputCharactersPointer++;
}

function moveMemoryPointerPreviousCell() {
    memoryPointer -= 1;
    inputCharactersPointer++;
}

function increaseMemoryInfoValue() {
    memoryInfo[memoryPointer] += 1;
    if(memoryInfo[memoryPointer] > CHAR_LIMIT)
        memoryInfo[memoryPointer] = 0;
    inputCharactersPointer++;
}

function decreaseMemoryInfoValue() {
    memoryInfo[memoryPointer] -= 1;
    if(memoryInfo[memoryPointer] < 0)
        memoryInfo[memoryPointer] = CHAR_LIMIT;
    inputCharactersPointer++;
}

function showMemoryInfoValue() {
    process.stdout.write(String.fromCharCode(memoryInfo[memoryPointer]));
    inputCharactersPointer++;
}

function jumpToHandPunchRight() {
    if(memoryInfo[memoryPointer] != 0) {
        nestedLoopIndex -= 1;
        const index = findNextHandPunchRight();
        inputCharactersPointer = index + 1;
    } else
        inputCharactersPointer++;
}

function jumpToHandPunchLeft() {
    if(memoryInfo[memoryPointer] == 0) {
        nestedLoopIndex += 1;
        const index = findNextHandPunchLeft();
        inputCharactersPointer = index + 1;
    } else
        inputCharactersPointer++;
}

function findNextHandPunchRight() {
    do {
        inputCharactersPointer--;
        checkNestedLoops();
    } while(inputCharacters[inputCharactersPointer] != '🤜' || nestedLoopIndex != 0);
    return inputCharactersPointer;
}

function findNextHandPunchLeft() {
    do {
        inputCharactersPointer++;
        checkNestedLoops();
    } while(inputCharacters[inputCharactersPointer] != '🤛' || nestedLoopIndex != 0);
    return inputCharactersPointer;
}

function checkNestedLoops() {
    if(inputCharacters[inputCharactersPointer] == '🤜')
        nestedLoopIndex++;

    if(inputCharacters[inputCharactersPointer] == '🤛')
        nestedLoopIndex--;
}