import { Injectable } from '@angular/core';
import { KeymapFormatStrategy } from '../models/keymapFormatStrategy';
import { LayoutSplit3x6_3_KeymapFormatStrategy } from '../models/layoutSplit3x6_3_KeymapFormatStrategy';
import { LayoutEnum } from '../models/layoutEnum';



@Injectable({
	providedIn: 'root'
})
export class FormatterService {
	constructor() { }

	private strategy: KeymapFormatStrategy | undefined;
	private strategies: KeymapFormatStrategy[] = [
		new LayoutSplit3x6_3_KeymapFormatStrategy()
	];

	formatToFile(layout: LayoutEnum, data: string): File {		
		this.strategy = this.strategies.find(s => s.canHandle(layout) === true)

		if (this.strategy) {
			return this.strategy.format(data);
		} else {
			throw new Error('No strategy set');
		}
	}
}
