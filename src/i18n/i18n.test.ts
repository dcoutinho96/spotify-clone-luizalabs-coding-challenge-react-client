import { describe, it, expect, beforeEach } from "vitest";
import { i18n } from "./";

describe("i18n configuration", () => {
    beforeEach(async () => {
        await i18n.changeLanguage("pt");
    });

    it("loads Portuguese translations", () => {
        const result = i18n.t("home.login-button");
        expect(result).toBeTypeOf("string");
        expect(result.length).toBeGreaterThan(0);
    });

    it("loads English translations", async () => {
        await i18n.changeLanguage("en");
        const result = i18n.t("home.login-button");
        expect(result).toBeTypeOf("string");
        expect(result.length).toBeGreaterThan(0);
    });

    it("falls back to Portuguese when key missing in English", async () => {
        await i18n.changeLanguage("en");
        const result = i18n.t("nonexistent.key", { defaultValue: "" });
        const fallback = i18n.getFixedT("pt")("nonexistent.key", { defaultValue: "" });
        expect(result).toBe(fallback);
    });

    it("performs interpolation correctly", () => {
        const result = i18n.t("greeting", { name: "Luiza", defaultValue: "Olá {{name}}" });
        expect(result).toContain("Luiza");
    });

});
