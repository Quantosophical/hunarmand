import { performSemanticTranslation } from "../src/lib/translationMock";

describe("Semantic Translation Interceptor", () => {
  it("translates known English phrases to Urdu/Kashmiri", () => {
    expect(performSemanticTranslation("hello")).toBe("Aadab / Salaam");
    expect(performSemanticTranslation("beautiful work")).toBe("Khoobsurat kaam");
    expect(performSemanticTranslation("thank you")).toBe("Shukriya");
  });

  it("handles case insensitivity and whitespace", () => {
    expect(performSemanticTranslation("  HeLLo  ")).toBe("Aadab / Salaam");
    expect(performSemanticTranslation("BEAUTIFUL WORK")).toBe("Khoobsurat kaam");
  });

  it("prepends [Translated] for unknown phrases", () => {
    expect(performSemanticTranslation("When will this arrive?")).toBe("[Translated]: When will this arrive?");
    expect(performSemanticTranslation("I want to buy 5 of these")).toBe("[Translated]: I want to buy 5 of these");
  });
});
