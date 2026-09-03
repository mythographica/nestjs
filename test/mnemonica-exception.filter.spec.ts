import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { HttpException } from '@nestjs/common';
import type { ArgumentsHost } from '@nestjs/common';
import { clear } from '@mnemonica/dive';
import { createTypesCollection } from 'mnemonica/module';
import { attachHooks } from '../src/index.js';
import { MnemonicaExceptionFilter } from '../src/filters/mnemonica-exception.filter.js';

type MockResponse = {
	status: ReturnType<typeof vi.fn>;
	json: ReturnType<typeof vi.fn>;
	end: ReturnType<typeof vi.fn>;
	headersSent: boolean;
};

function mockHost (res: MockResponse): ArgumentsHost {
	const host = {
		switchToHttp: () => ({
			getResponse: () => res,
		}),
	};
	return host as unknown as ArgumentsHost;
}

function mockRes (headersSent = false): MockResponse {
	const res: MockResponse = {
		status      : vi.fn(),
		json        : vi.fn(),
		end         : vi.fn(),
		headersSent,
	};
	res.status.mockReturnValue(res);
	return res;
}

describe('MnemonicaExceptionFilter', () => {
	beforeEach(() => {
		clear();
		vi.spyOn(console, 'log').mockImplementation(() => undefined);
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('passes expected HttpExceptions through to Nest\'s own answer', () => {
		const filter = new MnemonicaExceptionFilter();
		const res = mockRes();
		filter.catch(new HttpException('nope', 418), mockHost(res));

		expect(res.status).toHaveBeenCalledWith(418);
		expect(res.json).toHaveBeenCalledWith('nope');
		expect(console.log).not.toHaveBeenCalled();
	});

	it('answers a plain Error with an empty-branch unblinded report', () => {
		const filter = new MnemonicaExceptionFilter();
		const res = mockRes();
		filter.catch(new Error('plain boom'), mockHost(res));

		expect(res.status).toHaveBeenCalledWith(500);
		const report = res.json.mock.calls[0][0];
		expect(report).toEqual({
			kind            : 'nest-caught-unblinded',
			message         : 'plain boom',
			branch          : [],
			erroredType     : null,
			erroredInstance : null,
			attemptedArgs   : null,
		});
		expect(console.log).toHaveBeenCalledTimes(1);
	});

	it('recovers the errored construction: type, parent instance, attempted args', () => {
		const collection = createTypesCollection();
		attachHooks(collection);
		const Root = collection.define('FilterRoot', function (this: { id: string }, id: string) {
			this.id = id;
		});
		Root.define('FilterBroken', function (this: { ok: boolean }, data: { ok: boolean }) {
			this.ok = data.ok;
			throw new Error('sanity failed');
		});
		const parent = new Root('r1');

		let caught: Error | undefined;
		try {
			// @ts-expect-error — subtype constructor exists at runtime via define
			new parent.FilterBroken({ ok: false, marker: 'corner-cut-payload' });
		} catch (error) {
			caught = error as Error;
		}
		expect(caught).toBeInstanceOf(Error);

		const filter = new MnemonicaExceptionFilter();
		const res = mockRes();
		filter.catch(caught as Error, mockHost(res));

		const report = res.json.mock.calls[0][0];
		expect(report.kind).toBe('nest-caught-unblinded');
		expect(report.erroredType).toBe('FilterBroken');
		expect(report.branch).toContain('create:FilterBroken');
		// the errored edge attributes the PARENT instance
		expect(report.erroredInstance).toEqual({ id: 'r1' });
		// the attempted constructor args ride the errored instance itself
		expect(report.attemptedArgs).toEqual([{ ok: false, marker: 'corner-cut-payload' }]);
	});

	it('reports a non-Error throw truthfully, never dressed as an Error', () => {
		const filter = new MnemonicaExceptionFilter();
		const res = mockRes();
		const circular: { self?: unknown } = {};
		circular.self = circular;
		filter.catch(circular as unknown as Error, mockHost(res));

		const report = res.json.mock.calls[0][0];
		expect(report.kind).toBe('nest-caught-unblinded');
		expect(report.message).toBe('non-Error thrown (object)');
		expect(report.branch).toEqual([]);
		// the console marker survives circularity — the report line exists
		expect(console.log).toHaveBeenCalledTimes(1);
	});

	it('keeps telemetry but skips the body when headers are already sent', () => {
		const filter = new MnemonicaExceptionFilter();
		const res = mockRes(true);
		filter.catch(new Error('partial write poisoned'), mockHost(res));

		expect(res.json).not.toHaveBeenCalled();
		expect(res.status).not.toHaveBeenCalled();
		expect(res.end).toHaveBeenCalledTimes(1);
		// telemetry is unconditional — stdout still gets the report
		expect(console.log).toHaveBeenCalledTimes(1);
	});
});
