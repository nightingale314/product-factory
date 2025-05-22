import csv from "csv-parser";
import { Readable } from "stream";

type CsvRow = Record<string, string>;

export const extractRow = async (
  stream: Readable,
  rowIdx: number
): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    let currentRow = 0;
    let colValues: string[] = [];

    stream
      .pipe(csv({ headers: false }))
      .on("data", (row: CsvRow) => {
        if (currentRow === rowIdx) {
          colValues = Object.values(row);
        }

        currentRow++;
      })
      .on("end", () => resolve(colValues))
      .on("error", reject);
  });
};
