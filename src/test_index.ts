import { createConsoleReporter, createTestRunner } from '@cow-sunday/cowtest';
import { ticTacToeTestCases } from './tic_tac_toe/tic_tac_toe.test';

const reporter = createConsoleReporter();

const testRunner = createTestRunner(reporter);

testRunner.run(ticTacToeTestCases());
