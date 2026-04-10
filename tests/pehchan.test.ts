import { formatPehchanData, PehchanRawData } from "../src/lib/pehchanApi";

describe("Pehchan API Formatter", () => {
  it("formats valid raw data correctly", () => {
    const raw: PehchanRawData = {
      artisan_id_no: "PEH-2024-9981",
      name: "Sahil Mehraj",
      registered_date: "2015-06-15",
      craft_subsector: "Pashmina Weaving",
      state: "Jammu & Kashmir",
      awards_won: "National Master Weaver 2019, State Craft Excellence"
    };

    const formatted = formatPehchanData(raw);

    expect(formatted.pehchanId).toBe("PEH-2024-9981");
    expect(formatted.isVerified).toBe(true);
    expect(formatted.craftType).toBe("Pashmina Weaving");
    expect(formatted.state).toBe("Jammu & Kashmir");
    expect(formatted.awards).toContain("National Master Weaver 2019");
    expect(formatted.awards).toContain("State Craft Excellence");
    expect(formatted.awards.length).toBe(2);
    
    // 2026 - 2015 = 11 years experience (assuming tests run in 2026)
    const currentYear = new Date().getFullYear();
    expect(formatted.yearsExperience).toBe(currentYear - 2015);
  });

  it("handles missing awards correctly", () => {
    const raw: PehchanRawData = {
      artisan_id_no: "PEH-123",
      name: "Abdul Kafeel",
      registered_date: "2020-01-01",
      craft_subsector: "Wood Carving",
      state: "Jammu & Kashmir",
      awards_won: ""
    };

    const formatted = formatPehchanData(raw);
    expect(formatted.awards).toEqual([]);
  });

  it("throws error for invalid data", () => {
    expect(() => {
      formatPehchanData({} as PehchanRawData);
    }).toThrow("Invalid Pehchan Data");
  });
});
