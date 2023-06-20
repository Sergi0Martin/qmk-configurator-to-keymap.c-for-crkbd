import { Keymap } from "./keymap";
import { KeymapFormatStrategy } from "./keymapFormatStrategy";
import { LayoutEnum } from "./layoutEnum";

export class LayoutSplit3x6_3_KeymapFormatStrategy implements KeymapFormatStrategy {

	canHandle(layout: LayoutEnum): boolean {
		console.log(layout);
		console.log(layout === LayoutEnum.LayoutSplit3x6_3);

		return layout === LayoutEnum.LayoutSplit3x6_3;
	}

	public outputFileName = 'converted_keymap.c';
	public columns = 12;
	public rows = 3;
	public columnsBySide = this.columns / 2;
	public additionalRowColumns = 6;

	format(data: string): File {
		const keymap: Keymap = JSON.parse(data);

		if (keymap.layout !== 'LAYOUT_split_3x6_3') {
			throw new Error(`Not valid layout ${keymap.layout}, should be 'LAYOUT_split_3x6_3'`);
		}

		let output = `#include QMK_KEYBOARD_H\n
    const uint16_t PROGMEM keymaps[][MATRIX_ROWS][MATRIX_COLS] = {\r`;

		keymap.layers.forEach((layer, index) => {
			output += `    [${index}] = LAYOUT_split_3x6_3(\n//,-----------------------------------------------------.                    ,-----------------------------------------------------.\n`;
			layer.forEach((keycode, keycodeIndex) => {
				output += this.layerBuilder(keycode, keycodeIndex);
			});

			if (index + 1 === keymap.layers.length) {
				output += '\n  )\n};';
			} else {
				output += '\n  ),\n';
			}

		});

		return new File([output], this.outputFileName, { type: '.c' });
	}


	private layerBuilder(keycode: string, index: number): string {
		const spacesAtNewLine = 3;
		let outputText = '';

		// add lines between rows comment
		if (index !== 0 && index % this.columns === 0) {
			outputText = '\n//|--------+--------+--------+--------+--------+--------|                    |--------+--------+--------+--------+--------+--------|\n';
			if (index + 1 > (this.rows * this.columns)) {
				outputText = '\n//|--------+--------+--------+--------+--------+--------+--------|  |--------+--------+--------+--------+--------+--------+--------|\n';
			}
		}

		// new row beginning
		if (index % this.columns === 0) {
			if (index + 1 <= (this.rows * this.columns)) {
				outputText += ' '.repeat(spacesAtNewLine);
			} else {
				// last additional row
				outputText += ' '.repeat(39);
			}
		}

		outputText += this.addSpaceBetweenSides(index);

		// add keycode
		outputText += this.addKeycodeSpaces(keycode) + ',';

		// last line
		if (index + 1 === this.rows * this.columns + this.additionalRowColumns) {
			outputText = outputText.slice(0, -1);
			outputText += '\n' + ' '.repeat(36) + '//+--------------------------|  |--------------------------+';
		}

		return outputText;
	}

	private addKeycodeSpaces(keycode: string): string {
		const requiredSpaces = 8;

		const espacesToAdd = requiredSpaces - keycode.length > 0 ? requiredSpaces - keycode.length : 0;
		if (espacesToAdd < 0) {
			throw new Error('AddKeycodeSpaces error');
		}

		return ' '.repeat(espacesToAdd) + keycode;
	}

	private addSpaceBetweenSides(index: number): string {
		if (index % this.columnsBySide === 0 && index % this.columns !== 0) {
			return ' '.repeat(21);
		}

		if (index === (this.rows * this.columns + this.additionalRowColumns) - (this.additionalRowColumns / 2)) {
			return ' '.repeat(3);
		}

		return '';
	}
}