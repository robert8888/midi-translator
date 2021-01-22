import MidiTranslator from "./../src/index";
import MidiStatusTranslator from "./../src/MidiTranslator/MidiStatusTranslator";
import MidiDataTranslator from "./../src/MidiTranslator/MidiDataTranslator";


describe("Creating MidiTranslator instance", () => {

    it("Should Midi Translator instance be created and contain all components", () => {
        const translator = new MidiTranslator();
        expect(translator).toBeInstanceOf(MidiTranslator);
        expect(translator.statusTranslator).toBeInstanceOf(MidiStatusTranslator);
        expect(translator.dataTranslator).toBeInstanceOf(MidiDataTranslator);
        expect(translator.translate).toBeInstanceOf(Function)  
    })

    it("Should throw error when get not correct format data to translate function", () => {
        const translator = new MidiTranslator();
        expect(() => translator.translate(null)).toThrow(/Unrecognized message data format/)
        expect(() => translator.translate(undefined)).toThrow(/Unrecognized message data format/)
        expect(() => translator.translate([])).toThrow(/argument bad format/)
        expect(() => translator.translate(["a", "b", 1])).toThrow(/argument bad format/)
        expect(() => translator.translate([1,2,3,4])).toThrow(/argument bad format/)

        expect(() => translator.translate([1,2,3])).toThrow(/Unrecognized midi message code/)
        expect(() => translator.translate({data: [1,2,3]})).toThrow(/Unrecognized midi message code/)

        expect(() => translator.translate([129,2,3])).not.toThrow()
        expect(() => translator.translate({data: [129,2,3]})).not.toThrow()
    })
})