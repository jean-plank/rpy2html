const parser = require('../../src/converter/utils');


describe("removeComments(line)", () => {
    it("returns same string when no comments", () => {
        const str = "string without any comment";
        expect(parser.removeComments(str)).toBe(str);
    });

    it("returns same string no comments with quotes", () => {
        const str = "string without 'any' comment";
        expect(parser.removeComments(str)).toBe(str);
    });

    it("returns same string when # inside quotes 1", () => {
        const str = "string with 'a # comment' inside quotes";
        expect(parser.removeComments(str)).toBe(str);
    });

    it("returns same string when # inside quotes 2", () => {
        const str = "string 'with' 'a # comment' \"inside\" quotes";
        expect(parser.removeComments(str)).toBe(str);
    });

    it("removes comment 1", () => {
        const str = "string # comment";
        const res = "string ";
        expect(parser.removeComments(str)).toBe(res);
    });

    it("removes comment 2", () => {
        const str = "string 'with' 'a # comment' \"inside\" quotes # comment1 # comment2";
        const res = "string 'with' 'a # comment' \"inside\" quotes ";
        expect(parser.removeComments(str)).toBe(res);
    });

    it("removes comment 3", () => {
        const str = "string # \"comment\"";
        const res = "string ";
        expect(parser.removeComments(str)).toBe(res);
    });

    it("removes comment 4", () => {
        const str = "vicious 'comment\"' # test";
        const res = "vicious 'comment\"' ";
        expect(parser.removeComments(str)).toBe(res);
    });

    it("removes comment 5", () => {
        const str = "vicious 'comment\\'' # test";
        const res = "vicious 'comment\\'' ";
        expect(parser.removeComments(str)).toBe(res);
    });
});
