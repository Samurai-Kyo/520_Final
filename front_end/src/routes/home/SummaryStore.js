import { writable } from 'svelte/store';

// const sharedVariable = (() => {
// 	let count = 0;
// 	return {
// 		increment: () => {
// 			return count++;
// 		}
// 	};
// })();

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
		this.rating = new Rating(0, 0, 0);
	}
	getCode() {
		return this.summary;
	}

	getModel() {
		return this.apiName;
	}

	getScores() {
		return { nScore: this.rating.nScore, uScore: this.rating.uScore, cScore: this.rating.cScore };
	}

	/**
	 * @param {number} nScore
	 * @param {number} uScore
	 * @param {number} cScore
	 */
	setScores(nScore, uScore, cScore) {
		this.rating.nScore = nScore;
		this.rating.uScore = uScore;
		this.rating.cScore = cScore;
	}
	/**
	 * @param {{ summary: string; model: string; }} json
	 */
	static fromJson(json) {
		return new Summary(json.summary, json.model);
	}
}

export class Rating {
	/**
	 * @param {number} nScore
	 * @param {number} uScore
	 * @param {number} cScore
	 * @param {boolean} isFavorite
	 * @param {string} evalText
	 */
	constructor(nScore, uScore, cScore, isFavorite = false, evalText = '') {
		this.nScore = nScore;
		this.uScore = uScore;
		this.cScore = cScore;
		this.isFavorite = isFavorite;
		this.evalText = evalText;
	}
	getScores() {
		return { nScore: this.nScore, uScore: this.uScore, cScore: this.cScore };
	}
}

export class Summaries {
	/**
	 * @param {Array<Summary>} summaries
	 */
	constructor(summaries = [], id = 0) {
		this.summaries = summaries;
		this.id = id;
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
