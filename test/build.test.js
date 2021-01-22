
 import MidiTranslator, {MIDI_STATUS} from "./../dist/midi-translator";


describe("Test instance creation from production build", () => {
    test("Import from build and test instance", () =>{
        const translator = new MidiTranslator();
        expect(translator).toBeInstanceOf(MidiTranslator);
        expect(MIDI_STATUS).toBeInstanceOf(Object);
    })
    test("Simple translation", () =>{
        const translator = new MidiTranslator();
        const message = translator.translate([135,10,15]);
        expect(message.status).toBe(MIDI_STATUS.NOTE_OFF);
        expect(message.channel).toBe(8);
        expect(message.note).toBe(10);
        expect(message.velocity).toBe(15)
    })

    test("", () => {
        const translator = new MidiTranslator();
        const message = translator.translate([226,88,10]);
        console.log(message)
    })
})