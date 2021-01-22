# MIDI Message Translator
### Based on [status code description](https://www.midimountain.com/midi/midi_status.htm)

***
## Installation 

```
npm install midi-translator
```

## Usage

```javascript
import MidiTranslator, {MIDI_STATUS} from "midi-translator";

function noteOn(note, velocity){}      
function noteOff(note){}

     
function onMidiMessage(message){
    const msg = midiTranslator.translate(message.data);
    if(msg.status === MIDI_STATUS.NOTE_ON){
        msg.velocity 
            ? noteOn(msg.note, msg.velocity)
            : noteOff(msg.note)
    }
}

if(!navigator.requestMIDIAccess) return;

navigator.requestMIDIAccess().then((midiAccess) => {
    Array.from(midiAccess.inputs).forEach(([id, input]) => 
        input.onmidimessage = onInputMessage
    )
})

```

## Message object shape
NOTE ON 
```javascript
{
    status: 'NOTE_ON',
    channel: 2,
    note: 55,
    velocity: 80,
    original: [ 145, 55, 80 ],
    id: 'CH:2-N_ON:55'
}

```
NOTE OFF
```javascript
{
    status: 'NOTE_OFF',
    channel: 8,
    note: 10,
    velocity: 15,
    original: [ 135, 10, 15 ],
    id: 'CH:8-N_OFF:10'
}
```
POLYPHONIC AFTERTOUCH
```javascript
 {
    status: 'POLYPHONIC_AFTER_TOUCHE',
    channel: 4,
    note: 22,
    pressure: 100,
    original: [ 163, 22, 100 ],
    id: 'CH:4-PA:22'
}
```
CONTROL - MODE CHANGE - CC
```javascript
{
    status: 'CONTROL_CHANGE_CC',
    channel: 5,
    controller: 22,
    value: 100,
    min: false,
    max: false,
    increment: 36,
    decrement: 0,
    original: [ 180, 22, 100 ],
    id: 'CH:5-CC:22'
}
```
PROGRAM CHANGE
```javascript
{
    status: 'PROGRAM_CHANGE',
    channel: 6,
    program: 55,
    original: [ 197, 55, 100 ],
    id: 'CH:6-PC'
}
```
CHANNEL AFTERTOUCH
```javascript
 {
    status: 'CHANNEL_AFTER_TOUCHE',
    channel: 5,
    pressure: 55,
    original: [ 212, 55, 100 ],
    id: 'CH:5-CA'
}
```
PITCH WHEEL RANGE
```javascript
{
    status: 'PITCH_WHEEL_RANGE',
    channel: 3,
    value: 88,
    lsb: 88,
    msb: 10,
    original: [ 226, 88, 10 ],
    id: 'CH:3-PW'
}
```
There are more different message object shapes depending on the message status code. Above are listed only the most common one. But there exist more specific system codes. Bellow full list of midi status.

## MIDI Status
```javascript
import {MIDI_STATUS} from "midi-translator";

//shape
const MIDI_STATUS = {
    NOTE_ON : "NOTE_ON",
    NOTE_OFF : "NOTE_OFF",
    POLYPHONIC_AFTER_TOUCHE: "POLYPHONIC_AFTER_TOUCHE",
    CONTROL_CHANGE: "CONTROL_CHANGE_CC",
    PROGRAM_CHANGE: "PROGRAM_CHANGE",
    CHANNEL_AFTER_TOUCHE : "CHANNEL_AFTER_TOUCHE",
    PITCH_WHEEL_RANGE: "PITCH_WHEEL_RANGE",
    SYSTEM_EXCLUSIVE: "SYSTEM_EXCLUSIVE",
    SYSTEM_COMMON : "SYSTEM_COMMON",
    SONG_POSITION_POINTER: "SONG_POSITION_POINTER",
    SONG_SELECT: "SONG_SELECT",
    TIMING_CLOCK: "TIMING_CLOCK",
    START: "START",
    CONTINUE: "CONTINUE",
    STOP: "STOP",
    ACTIVE_SENSING: "ACTIVE_SENSING",
    RESET: "SYSTEM_RESET",
    TUNE_REQUEST: "TUNE_REQUEST",
    END_SYSEX: "END_SYSEX",
    OTHER: "OTHER"
}
```