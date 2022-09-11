export enum GameState {
  WAITING_FOR_PLAYERS = 'waitingForPlayers',
  IN_PROGRESS = 'inProgress',
  FINISHED = 'finished'
}

export enum EdgeState {
    Border = 'edgeBorder',
    Opening = 'edgeOpening',
    Unknown = 'edgeUnknown',
    Wall = 'edgeWall'
  }
  
export enum Orientation {
  Horizontal = 'horizontal',
  Vertical = 'vertical'
}

export enum SquareState {
  Unknown,
  ReachableNotChecked,
  ReachableChecked
}

export class Piece {
  horizontal: number;
  vertical: number;
  constructor(horizontal: number, vertical: number ) {
    this.horizontal = horizontal;
    this.vertical = vertical;
  }
}

export class Game {
  id: string;
  gameState: GameState;
  player1: string;
  player1Board: GameModel;
  player2: string;
  player2Board: GameModel;
}
  
export class GameModel {
  horizontalEdges: EdgeState[][] = [
    [EdgeState.Border, EdgeState.Unknown, EdgeState.Unknown, EdgeState.Unknown, EdgeState.Unknown, EdgeState.Unknown, EdgeState.Border],
    [EdgeState.Border, EdgeState.Unknown, EdgeState.Unknown, EdgeState.Unknown, EdgeState.Unknown, EdgeState.Unknown, EdgeState.Border],
    [EdgeState.Border, EdgeState.Unknown, EdgeState.Unknown, EdgeState.Unknown, EdgeState.Unknown, EdgeState.Unknown, EdgeState.Border],
    [EdgeState.Border, EdgeState.Unknown, EdgeState.Unknown, EdgeState.Unknown, EdgeState.Unknown, EdgeState.Unknown, EdgeState.Border],
    [EdgeState.Border, EdgeState.Unknown, EdgeState.Unknown, EdgeState.Unknown, EdgeState.Unknown, EdgeState.Unknown, EdgeState.Border],
    [EdgeState.Border, EdgeState.Unknown, EdgeState.Unknown, EdgeState.Unknown, EdgeState.Unknown, EdgeState.Unknown, EdgeState.Border],
    [EdgeState.Border, EdgeState.Unknown, EdgeState.Unknown, EdgeState.Unknown, EdgeState.Unknown, EdgeState.Unknown, EdgeState.Border]
  ]
  marker = new Piece(0, 0);
  squares: SquareState[][]  = [
    [SquareState.ReachableNotChecked, SquareState.Unknown, SquareState.Unknown, SquareState.Unknown, SquareState.Unknown, SquareState.Unknown],
    [SquareState.Unknown, SquareState.Unknown, SquareState.Unknown, SquareState.Unknown, SquareState.Unknown, SquareState.Unknown],
    [SquareState.Unknown, SquareState.Unknown, SquareState.Unknown, SquareState.Unknown, SquareState.Unknown, SquareState.Unknown], 
    [SquareState.Unknown, SquareState.Unknown, SquareState.Unknown, SquareState.Unknown, SquareState.Unknown, SquareState.Unknown], 
    [SquareState.Unknown, SquareState.Unknown, SquareState.Unknown, SquareState.Unknown, SquareState.Unknown, SquareState.Unknown], 
    [SquareState.Unknown, SquareState.Unknown, SquareState.Unknown, SquareState.Unknown, SquareState.Unknown, SquareState.Unknown], 
  ];
  target = new Piece(5, 5);
  validRouteExists: boolean = true;
  verticalEdges: EdgeState[][] = [
    [EdgeState.Border, EdgeState.Border, EdgeState.Border, EdgeState.Border, EdgeState.Border, EdgeState.Border, EdgeState.Border],
    [EdgeState.Unknown, EdgeState.Unknown, EdgeState.Unknown, EdgeState.Unknown, EdgeState.Unknown, EdgeState.Unknown, EdgeState.Unknown],
    [EdgeState.Unknown, EdgeState.Unknown, EdgeState.Unknown, EdgeState.Unknown, EdgeState.Unknown, EdgeState.Unknown, EdgeState.Unknown],
    [EdgeState.Unknown, EdgeState.Unknown, EdgeState.Unknown, EdgeState.Unknown, EdgeState.Unknown, EdgeState.Unknown, EdgeState.Unknown],
    [EdgeState.Unknown, EdgeState.Unknown, EdgeState.Unknown, EdgeState.Unknown, EdgeState.Unknown, EdgeState.Unknown, EdgeState.Unknown],
    [EdgeState.Unknown, EdgeState.Unknown, EdgeState.Unknown, EdgeState.Unknown, EdgeState.Unknown, EdgeState.Unknown, EdgeState.Unknown],
    [EdgeState.Border, EdgeState.Border, EdgeState.Border, EdgeState.Border, EdgeState.Border, EdgeState.Border, EdgeState.Border]
  ]
}