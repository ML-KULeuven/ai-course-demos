export default class History {
  
    constructor(tiles) {
        this.boardStates = [];
        this.currentBoardState = -1;
        this.addBoardState(_.cloneDeep(tiles));
    }

    getBoardStates() {
        return this.boardStates;
    }

    addBoardState(board) {
        this.currentBoardState++;
        let newBoard = _.cloneDeep(board);
        this.pruneHistory();
        this.boardStates.push(newBoard);
    }

    getCurrentBoardState() {
        return _.cloneDeep(this.boardStates[this.currentBoardState]);
    }

    undo() {
        if (this.currentBoardState > 0) {
            this.currentBoardState--;
        }
        return this.getCurrentBoardState();
    }

    redo() {
        if (this.currentBoardState+1 < this.boardStates.length) {
            this.currentBoardState++;
        }
        return this.getCurrentBoardState();
    }

    pruneHistory() {
        let temp = _.cloneDeep(this);
        let historyLength = temp.boardStates.length;
        for (let i = this.currentBoardState; i < historyLength; i++) {
            this.boardStates.pop();
        }
    }
}