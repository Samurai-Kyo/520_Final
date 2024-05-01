import { writable } from 'svelte/store';

const sharedVariable = (() => {
	let count = 0;
	return {
		increment: () => {
			return count++;
		}
	};
})();

export class Summary {
	/**
	 * @param {string} code
	 * @param {string} model
	 */
	constructor(code, model) {
		this.code = code;
		this.model = model;
		this.id = sharedVariable.increment();
	}
	getCode() {
		return this.code;
	}

	getModel() {
		return this.model;
	}

	getId() {
		return this.id;
	}

	/**
	 * @param {any} json
	 */
	static fromJson(json) {
		return new Summary(json.code, json.model);
	}
}

export class Summaries {
	/**
	 * @param {Array<Summary>} summmaries
	 */
	constructor(summmaries = []) {
		this.summmaries = summmaries;
	}
	getSummaries() {
		return this.summmaries;
	}

	/**
     * @param {any} json
	 */
	addTask(json) {
		const summary = Summary.fromJson(json);
		this.summmaries.push(summary);
	}


	/**
     * @param {any[]} json
     */
	static fromJson(json) {
        const summaries =  new Summaries(json.map((summary) => new Summary(summary.code, summary.model));
		return summaries;
	}
}

/**
 * This is the store that will hold the list of tasks.
 */
export const TaskStore = writable(Summaries.fromJson([]));
