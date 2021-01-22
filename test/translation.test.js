import MidiTranslator, {MIDI_STATUS} from "./../src/index";
import range from "./utils/range";

describe("Testing midi message", () => {
    let translator;
    beforeEach(() => {
        translator = new MidiTranslator();
    })

    it("Should throw unrecognized midi message", () => {
        const messages = [
            [127, 0, 0],
            [80, 0, 0],
            [130, 128, 0],
            [130, 120, 128],
            [120, 0, 0],
        ]
        messages.forEach(message => {
            expect(() => translator.translate(message)).toThrow(/Unrecognized midi message code/)
        })
    })

    it("Should correct translate midi status", () => {
        const tests = [
            {range: range(128,143), status: MIDI_STATUS.NOTE_OFF},
            {range: range(144, 159), status: MIDI_STATUS.NOTE_ON},
            {range: range(160, 175), status: MIDI_STATUS.POLYPHONIC_AFTER_TOUCHE},
            {range: range(176, 191), status: MIDI_STATUS.CONTROL_CHANGE},
            {range: range(192, 207), status: MIDI_STATUS.PROGRAM_CHANGE},
            {range: range(208, 223), status: MIDI_STATUS.CHANNEL_AFTER_TOUCHE},
            {range: range(224, 239), status: MIDI_STATUS.PITCH_WHEEL_RANGE},
            {range: [240], status: MIDI_STATUS.SYSTEM_EXCLUSIVE},
            {range: [241,244,245], status: MIDI_STATUS.SYSTEM_COMMON},
            {range: [242], status: MIDI_STATUS.SONG_POSITION_POINTER},
            {range: [243], status: MIDI_STATUS.SONG_SELECT},
            {range: [246], status: MIDI_STATUS.TUNE_REQUEST},
            {range: [247], status: MIDI_STATUS.END_SYSEX},
            {range: [248], status: MIDI_STATUS.TIMING_CLOCK},
            {range: [249,253], status: MIDI_STATUS.OTHER},
            {range: [250], status: MIDI_STATUS.START},
            {range: [251], status: MIDI_STATUS.CONTINUE},
            {range: [252], status: MIDI_STATUS.STOP},
            {range: [254], status: MIDI_STATUS.ACTIVE_SENSING},
            {range: [255], status: MIDI_STATUS.RESET},
        ]
        tests.forEach(test => {
            test.range.forEach(byte => {
                const message = translator.translate([byte, 0, 0]);
                expect(message.status).toBe(test.status);
            })
        })
    })

    test("Note Off", () => {
        const tests = [
            [135, 0, 80],
            [130, 50, 0],
            [135, 8, 127],
            [140, 127, 60]
        ]
        tests.forEach(data => {
            const message = translator.translate(data);
            expect(message.status).toBe(MIDI_STATUS.NOTE_OFF);
            expect(message.channel).toBe(data[0] - 127);
            expect(message.note).toBe(data[1])
            expect(message.velocity).toBe(data[2])
        })
    })
    test("Note On", () => {
        const tests = [
            [144, 66, 8],
            [148, 77, 2],
            [152, 98, 15],
            [156, 8, 127]
        ]
        tests.forEach(data => {
            const message = translator.translate(data);
            expect(message.status).toBe(MIDI_STATUS.NOTE_ON);
            expect(message.channel).toBe(data[0] - 143);
            expect(message.note).toBe(data[1])
            expect(message.velocity).toBe(data[2])
        })
    })

    test("Polyphonic Aftertouch", () => {
        const tests = [
            [160, 66, 8],
            [165, 77, 2],
            [170, 98, 15],
            [174, 8, 127]
        ]
        tests.forEach(data => {
            const message = translator.translate(data);
            expect(message.status).toBe(MIDI_STATUS.POLYPHONIC_AFTER_TOUCHE);
            expect(message.channel).toBe(data[0] - 159);
            expect(message.note).toBe(data[1])
            expect(message.pressure).toBe(data[2])
        })
    })
    
    test("Control/Mode change", () => {
        const tests = [
            [176, 66, 40],
            [180, 77, 80],
            [184, 98, 63],
            [191, 8, 127]
        ]
        tests.forEach(data => {
            const message = translator.translate(data);
            expect(message.status).toBe(MIDI_STATUS.CONTROL_CHANGE);
            expect(message.channel).toBe(data[0] - 175);
            expect(message.controller).toBe(data[1])
            switch(data[2]){
                case 63: {
                    expect(message.min).toBe(true)
                    break;
                }
                case 127: {
                    expect(message.max).toBe(true)
                    break;
                }
                case 40: {
                    expect(message.decrement).toBe(40);
                    break;
                }
                case 80: {
                    expect(message.increment).toBe(80 - 64)
                    break;
                }
            }

        })
    })

    test("Program change", () => {
        const tests = [
            [192, 66, 8],
            [198, 77, 2],
            [204, 98, 15],
            [207, 8, 127]
        ]
        tests.forEach(data => {
            const message = translator.translate(data);
            expect(message.status).toBe(MIDI_STATUS.PROGRAM_CHANGE);
            expect(message.channel).toBe(data[0] - 191);
            expect(message.program).toBe(data[1])
            expect(message.id).toBe(`CH:${data[0] - 191}-PC`)
        })
    })

    test("Channel Aftertouch", () => {
        const tests = [
            [208, 66, 8],
            [213, 77, 2],
            [221, 98, 15],
            [222, 8, 127]
        ]
        tests.forEach(data => {
            const message = translator.translate(data);
            expect(message.status).toBe(MIDI_STATUS.CHANNEL_AFTER_TOUCHE);
            expect(message.channel).toBe(data[0] - 207);
            expect(message.pressure).toBe(data[1])
            expect(message.id).toBe(`CH:${data[0] - 207}-CA`)
        })
    })

    test("Pitch wheel range", () => {
        const tests = [
            [224, 66, 8],
            [227, 77, 2],
            [230, 98, 15],
            [239, 8, 127]
        ]
        tests.forEach(data => {
            const message = translator.translate(data);
            expect(message.status).toBe(MIDI_STATUS.PITCH_WHEEL_RANGE);
            expect(message.channel).toBe(data[0] - 223);
            expect(message.value).toBe(data[1])
            expect(message.lsb).toBe(data[1])
            expect(message.msb).toBe(data[2])
            expect(message.id).toBe(`CH:${data[0] - 223}-PW`)
        })
    })

    test("System exclusive", () => {
        const message = translator.translate([240, 8, 6])
        expect(message.status).toBe(MIDI_STATUS.SYSTEM_EXCLUSIVE);
        expect(message.vendorId).toBe(8);
        expect(message.data).toBe(6)
    })

    test("Song position pointer", () => {
        const message = translator.translate([242, 84, 65])
        expect(message.status).toBe(MIDI_STATUS.SONG_POSITION_POINTER);
        expect(message.lsb).toBe(84);
        expect(message.msb).toBe(65)
    })
})