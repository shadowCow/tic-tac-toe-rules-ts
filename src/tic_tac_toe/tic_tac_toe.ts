import { assertNever } from '@cow-sunday/fp-ts';
import {
  GameRules,
  invalidMove,
  madeMove,
  moveEndedGame,
  tie,
  unfinished,
  winner,
} from '@cow-sunday/game-rules-ts';

export type TicTacToeRules = GameRules<TicTacToeState, TicTacToeMove>;

export function createTicTacToeRules(): TicTacToeRules {
  return {
    initState() {
      const board: TicTacToeState['board'] = [];
      board.length = 9;
      board.fill(undefined, 0, 9);

      return {
        board,
        playerTurn: 'x',
      };
    },
    isValidMove(s, m) {
      return m.tile >= 0 && m.tile < 9 && s.board[m.tile] === undefined;
    },
    onMove(s, m) {
      if (s.playerTurn !== m.owner) {
        return invalidMove({ reason: outOfTurnMessage(s.playerTurn, m.owner) });
      } else if (this.isValidMove(s, m)) {
        const nextBoard = s.board.map((owner, index) => {
          if (index === m.tile) {
            return m.owner;
          } else {
            return owner;
          }
        });

        const nextState: TicTacToeState = {
          board: nextBoard,
          playerTurn: nextTurn(s.playerTurn),
        };

        const outcome = this.getOutcome(nextState);

        switch (outcome.kind) {
          case tie.kind:
          case winner.kind:
            return moveEndedGame({ state: nextState });
          case unfinished.kind:
            return madeMove({ state: nextState });
          default:
            assertNever(outcome);
        }
      } else {
        return invalidMove({ reason: tileAlreadyOccupiedMessage(m.tile) });
      }
    },
    getOutcome(s) {
      if (
        s.board[0] !== undefined &&
        s.board[0] === s.board[1] &&
        s.board[1] === s.board[2]
      ) {
        // row1 winner
        return winner({ playerId: s.board[0] });
      } else if (
        s.board[3] !== undefined &&
        s.board[3] === s.board[4] &&
        s.board[4] === s.board[5]
      ) {
        // row2 winner
        return winner({ playerId: s.board[3] });
      } else if (
        s.board[6] !== undefined &&
        s.board[6] === s.board[7] &&
        s.board[7] === s.board[8]
      ) {
        // row3 winner
        return winner({ playerId: s.board[6] });
      } else if (
        s.board[0] !== undefined &&
        s.board[0] === s.board[3] &&
        s.board[3] === s.board[6]
      ) {
        // col1 winner
        return winner({ playerId: s.board[0] });
      } else if (
        s.board[1] !== undefined &&
        s.board[1] === s.board[4] &&
        s.board[4] === s.board[7]
      ) {
        // col2 winner
        return winner({ playerId: s.board[1] });
      } else if (
        s.board[2] !== undefined &&
        s.board[2] === s.board[5] &&
        s.board[5] === s.board[8]
      ) {
        // col3 winner
        return winner({ playerId: s.board[2] });
      } else if (
        s.board[0] !== undefined &&
        s.board[0] === s.board[4] &&
        s.board[4] === s.board[8]
      ) {
        // diag1 winner
        return winner({ playerId: s.board[0] });
      } else if (
        s.board[2] !== undefined &&
        s.board[2] === s.board[4] &&
        s.board[4] === s.board[6]
      ) {
        // diag2 winner
        return winner({ playerId: s.board[2] });
      } else if (s.board.every((tileState) => tileState !== undefined)) {
        // tie
        return tie();
      } else {
        return unfinished();
      }
    },
  };
}

export type TicTacToeState = {
  board: Array<TileState>;
  playerTurn: PlayerMarker;
};

export type TileState = PlayerMarker | undefined;

export type PlayerMarker = 'x' | 'o';

export type TicTacToeMove = { tile: number; owner: PlayerMarker };

function nextTurn(currentTurn: PlayerMarker): PlayerMarker {
  if (currentTurn === 'x') {
    return 'o';
  } else {
    return 'x';
  }
}

export function outOfTurnMessage(
  currentTurn: PlayerMarker,
  mover: PlayerMarker,
): string {
  return `Cannot move for player ${mover} on player ${currentTurn} turn.`;
}

export function tileAlreadyOccupiedMessage(tileIndex: number): string {
  return `Tile ${tileIndex} is already occupied.`;
}
