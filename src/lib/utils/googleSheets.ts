export async function getSpreadsheetValues(
	id: string,
	sheet: string
): Promise<{ status: number; rows: Record<string, any>[] }> {
	const response = await fetch(
		`https://sheets.googleapis.com/v4/spreadsheets/${id}/values/${sheet}?key=${import.meta.env.VITE_GOOGLE_API_KEY}`
	);
	const data = await response.json();
	// 將資料轉成物件陣列
	const rows: Record<string, any>[] = [];
	const rawRows: string[][] = data.values || [[]];
	const headers: string[] = rawRows.shift() || [];
	for (const row of rawRows) {
		const rowData = row.reduce<Record<string, any>>((acc, cell, index) => {
			const header = headers[index];
			if (header) {
				let value: any = cell;
				if (cell != null && cell.trim() !== '' && !isNaN(Number(cell))) {
					value = Number(cell);
				} else if (cell?.toLowerCase() === 'true') {
					value = true;
				} else if (cell?.toLowerCase() === 'false') {
					value = false;
				}
				acc[header] = value;
			}
			return acc;
		}, {});
		rows.push(rowData);
	}
	return {
		status: response.status,
		rows
	};
}
