import { writable } from 'svelte/store';

const sharedVariable = (() => {
	let count = 0;
	return {
		increment: () => {
			return count++;
		}
	};
})();

/**
 * @param {string} code
 * @param {string} model
 */
export class Summary {
	/**
	 * @param {string} summary
	 * @param {string} model
	 */
	constructor(summary, model) {
		this.summary = summary;
		this.apiName = model;
		(this.nScore = 1), (this.uScore = 1), (this.cScore = 1), (this.evalText = '');
		this.id = sharedVariable.increment();
	}
	getCode() {
		return this.summary;
	}

	getModel() {
		return this.apiName;
	}

	getId() {
		return this.id;
	}

	getScores() {
		return { nScore: this.nScore, uScore: this.uScore, cScore: this.cScore };
	}

	/**
	 * @param {number} nScore
	 * @param {number} uScore
	 * @param {number} cScore
	 */
	setScores(nScore, uScore, cScore) {
		this.nScore = nScore;
		this.uScore = uScore;
		this.cScore = cScore;
	}

	getEvalText() {
		return this.evalText;
	}

	/**
	 * @param {string} evalText
	 */
	setEvalText(evalText) {
		this.evalText = evalText;
	}

	/**
	 * @param {{ summary: string; model: string; }} json
	 */
	static fromJson(json) {
		return new Summary(json.summary, json.model);
	}
}

export class Summaries {
	/**
	 * @param {Array<Summary>} summaries
	 */
	constructor(summaries = []) {
		this.summaries = summaries;
	}
	getSummaries() {
		return this.summaries;
	}

	/**
	 * @param {{ summary: string; model: string; }} json
	 */
	addSummary(json) {
		const summary = Summary.fromJson(json);
		this.summaries.push(summary);
	}

	/**
	 * @param {any[]} json
	 */
	static fromJson(json) {
		const summaries = new Summaries(
			json.map((summary) => new Summary(summary.code, summary.model))
		);
		return summaries;
	}
}

/**
 * This is the store that will hold the list of tasks.
 */
export const Store = writable(Summaries.fromJson([]));
