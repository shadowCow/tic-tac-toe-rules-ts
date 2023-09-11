import { TestCase } from '@cow-sunday/cowtest';
import {
  TicTacToeState,
  createTicTacToeRules,
  outOfTurnMessage,
  tileAlreadyOccupiedMessage,
} from './tic_tac_toe';
import assert from 'node:assert';
import {
  invalidMove,
  madeMove,
  moveEndedGame,
  tie,
  unfinished,
  winner,
} from '@cow-sunday/game-rules-ts';

export function ticTacToeTestCases(): Array<TestCase> {
  const rules = createTicTacToeRules();

  return [
    {
      description: 'check for valid move',
      test: () => {
        const isValid = rules.isValidMove(rules.initState(), {
          tile: 0,
          owner: 'x',
        });

        assert.equal(isValid, true);
      },
    },
    {
      description: 'check for an invalid move',
      test: () => {
        const isValid = rules.isValidMove(anEarlyGame(), {
          tile: 0,
          owner: 'x',
        });

        assert.equal(isValid, false);
      },
    },
    {
      description: 'initState returns an empty board with player x to play',
      test: () => {
        const state = rules.initState();

        assert.deepStrictEqual(state, aNewGame());
      },
    },
    {
      description: 'a valid move that does not end the game',
      test: () => {
        const state = anEarlyGame();

        const result = rules.onMove(state, { tile: 8, owner: 'o' });

        assert.deepStrictEqual(
          result,
          madeMove<TicTacToeState>({
            state: {
              board: [
                'x',
                'o',
                'x',
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                'o',
              ],
              playerTurn: 'x',
            },
          }),
        );
      },
    },
    {
      description: 'a valid move that ends the game',
      test: () => {
        const state = aLateGame();
        const result = rules.onMove(state, { tile: 6, owner: 'x' });

        assert.deepStrictEqual(
          result,
          moveEndedGame({
            state: aLateGameWon(),
          }),
        );
      },
    },
    {
      description: 'an invalid move',
      test: () => {
        const state = anEarlyGame();
        const result = rules.onMove(state, { tile: 0, owner: 'o' });

        assert.deepStrictEqual(
          result,
          invalidMove({ reason: tileAlreadyOccupiedMessage(0) }),
        );
      },
    },
    {
      description: 'a move out of turn',
      test: () => {
        const state = anEarlyGame();
        const result = rules.onMove(state, { tile: 8, owner: 'x' });

        assert.deepStrictEqual(
          result,
          invalidMove({ reason: outOfTurnMessage('o', 'x') }),
        );
      },
    },
    {
      description: 'getOutcome for an unfinished game',
      test: () => {
        const result = rules.getOutcome(aLateGame());
        assert.deepStrictEqual(result, unfinished());
      },
    },
    {
      description: 'getOutcome for a game that ended with a tie',
      test: () => {
        const result = rules.getOutcome(aTiedGame());
        assert.deepStrictEqual(result, tie());
      },
    },
    {
      description: 'getOutcome for a game that ended with a winner',
      test: () => {
        const result = rules.getOutcome(aLateGameWon());
        assert.deepStrictEqual(result, winner({ playerId: 'x' }));
      },
    },
  ];
}

function anEmptyBoard(): TicTacToeState['board'] {
  const board = [
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
  ];

  return board;
}

function aNewGame(): TicTacToeState {
  return {
    board: anEmptyBoard(),
    playerTurn: 'x',
  };
}

function anEarlyGame(): TicTacToeState {
  return {
    board: [
      'x',
      'o',
      'x',
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
    ],
    playerTurn: 'o',
  };
}

function aLateGame(): TicTacToeState {
  return {
    board: ['x', 'o', 'x', 'x', 'o', 'o', undefined, undefined, undefined],
    playerTurn: 'x',
  };
}

function aLateGameWon(): TicTacToeState {
  return {
    board: ['x', 'o', 'x', 'x', 'o', 'o', 'x', undefined, undefined],
    playerTurn: 'o',
  };
}

function aTiedGame(): TicTacToeState {
  return {
    board: ['x', 'x', 'o', 'o', 'o', 'x', 'x', 'o', 'x'],
    playerTurn: 'o',
  };
}
