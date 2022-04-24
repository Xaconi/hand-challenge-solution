// Imports
const process = require( 'process' );
const fs = require('fs');

// Helpers
let errorDetected = false;
let inputCharacters = [];
let inputCharactersPointer = 0;
let memoryInfo = [0];
let memoryPointer = 0;

// Constants
const CHAR_LIMIT = 255;
const HAND_FINGER_UP = '👆';
const HAND_FINGER_DOWN = '👇';
const HAND_FINGER_LEFT = '👈';
const HAND_FINGER_RIGHT = '👉';
const HAND_PUNCH_LEFT = '🤛';
const HAND_PUNCH_RIGHT = '🤜';
const HAND_PUNCH = '👊';

// Read input
const inputFile = process.argv.find(argument => argument.startsWith( `--input=` ));
const inputFileValue = inputFile.replace(`--input=` , '');

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
        // Execute input instruction
        switch(char) {
            case HAND_FINGER_RIGHT:
                moveMemoryPointerNextCell();
                inputCharactersPointer++;
                break;
            case HAND_FINGER_LEFT:
                moveMemoryPointerPreviousCell();
                inputCharactersPointer++;
                break;
            case HAND_FINGER_UP:
                increaseMemoryInfoValue();
                inputCharactersPointer++;
                break;
            case HAND_FINGER_DOWN:
                decreaseMemoryInfoValue();
                inputCharactersPointer++;
                break;
            case HAND_PUNCH:
                showMemoryInfoValue();
                inputCharactersPointer++;
                break;
            case HAND_PUNCH_LEFT:
                jumpToHandPunchRight();
                break;
            case HAND_PUNCH_RIGHT:
                jumpToHandPunchLeft();
                break;
        }
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
}

function moveMemoryPointerPreviousCell() {
    memoryPointer -= 1;
}

function increaseMemoryInfoValue() {
    memoryInfo[memoryPointer] += 1;
    if(memoryInfo[memoryPointer] > CHAR_LIMIT)
        memoryInfo[memoryPointer] = 0;
}

function decreaseMemoryInfoValue() {
    memoryInfo[memoryPointer] -= 1;
    if(memoryInfo[memoryPointer] < 0)
        memoryInfo[memoryPointer] = CHAR_LIMIT;
}

function showMemoryInfoValue() {
    console.log(String.fromCharCode(memoryInfo[memoryPointer]));
}

function jumpToHandPunchRight() {
    if(memoryInfo[memoryPointer] != 0) {
        const index = findNextHandPunchRight();
        inputCharactersPointer = index + 1;
    } else
        inputCharactersPointer++;
}

function jumpToHandPunchLeft() {
    if(memoryInfo[memoryPointer] == 0) {
        const index = findNextHandPunchLeft();
        inputCharactersPointer = index + 1;
    } else
        inputCharactersPointer++;
}

function findNextHandPunchRight() {
    while(inputCharacters[inputCharactersPointer] != HAND_PUNCH_RIGHT){
        inputCharactersPointer--;
    } 
    return inputCharactersPointer;
}

function findNextHandPunchLeft() {
    while(inputCharacters[inputCharactersPointer] != HAND_PUNCH_LEFT) {
        inputCharactersPointer++;
    }
    return inputCharactersPointer;
}