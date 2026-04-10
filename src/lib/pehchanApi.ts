// Mock Pehchan API Formatter

export interface PehchanRawData {
  artisan_id_no: string;
  name: string;
  registered_date: string;
  craft_subsector: string;
  state: string;
  awards_won: string; // comma separated
}

export function formatPehchanData(rawData: PehchanRawData) {
  if (!rawData || !rawData.artisan_id_no) {
    throw new Error("Invalid Pehchan Data");
  }

  const registeredYear = new Date(rawData.registered_date).getFullYear();
  const currentYear = new Date().getFullYear();
  const yearsExperience = currentYear - registeredYear;

  const awardsList = rawData.awards_won 
    ? rawData.awards_won.split(",").map(a => a.trim()).filter(Boolean)
    : [];

  return {
    pehchanId: rawData.artisan_id_no,
    isVerified: true,
    yearsExperience: Math.max(0, yearsExperience),
    awards: awardsList,
    craftType: rawData.craft_subsector,
    state: rawData.state
  };
}
