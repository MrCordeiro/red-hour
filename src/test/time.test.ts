import { setMeeting } from '../time';
import assert from 'assert';
import 'mocha';

type TestCase = {
  inputs: [string, string];
  expected: string;
  description: string;
};

const tests: TestCase[] = [
  {
    inputs: ['2022-01-01', '10am'],
    expected: '2022-01-01T10:00:00',
    description: 'Should correctly parse AM time',
  },
  {
    inputs: ['2022-01-01', '12pm'],
    expected: '2022-01-01T12:00:00',
    description: 'Should correctly parse PM time',
  },
  {
    inputs: ['2022-01-01', '12am'],
    expected: '2022-01-01T00:00:00',
    description: 'Should correctly parse midnight',
  },
  {
    inputs: ['2022-01-01', '9:30am'],
    expected: '2022-01-01T09:30:00',
    description: 'Should correctly parse half past hour time',
  },
  {
    inputs: ['2022-01-01', 'invalid'],
    expected: 'Error',
    description: 'Should throw error for invalid time',
  },
  {
    inputs: ['invalid', '10am'],
    expected: 'Error',
    description: 'Should throw error for invalid date',
  },
];

suite('setMeeting', () => {
  tests.forEach((testCase) => {
    test(testCase.description, () => {
      if (testCase.expected === 'Error') {
        assert.throws(() => setMeeting(...testCase.inputs));
      } else {
        const result = setMeeting(...testCase.inputs);
        assert.strictEqual(result.toString(), new Date(testCase.expected).toString());
      }
    });
  });
});
