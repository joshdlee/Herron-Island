import axios from "axios";

async function tideDataFetcher(beginDate: string, endDate: string): Promise<any[]> {
  const station = "9446583";
  const timeZone = "lst_ldt";
  const units = "english";
  const interval = "hilo";
  const format = "json";

  const url = `https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?product=predictions&application=NOS.COOPS.TAC.WL&begin_date=${beginDate}&end_date=${endDate}&datum=MLLW&station=${station}&time_zone=${timeZone}&units=${units}&interval=${interval}&format=${format}`;

  try {
    const response = await axios.get(url);
    return response.data.predictions;
  } catch (error) {
    console.error("Failed to fetch tide data:", error);
    return [];
  }
}

export default tideDataFetcher;

