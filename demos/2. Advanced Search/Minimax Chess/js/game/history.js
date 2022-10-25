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
        let newBoard = _.cloneDeep(board);
        this.pruneHistory();
        this.boardStates.push(newBoard);
        this.currentBoardState++;
    }

    getCurrentBoardState() {
        return this.boardStates[this.currentBoardState];
    }

    undo() {
        if (this.currentBoardState > 0) {
            this.currentBoardState--;
        }
        print(this.boardStates);
        print(this.currentBoardState);
        return this.getCurrentBoardState();
    }

    redo() {
        if (this.currentBoardState+1 < this.boardStates.length) {
            this.currentBoardState++;
        }
        print(this.boardStates);
        print(this.currentBoardState);
        return this.getCurrentBoardState();
    }

    pruneHistory() {
        let historyLength = this.boardStates.length;
        for (let i = this.currentBoardState+1; i < historyLength; i++) {
            print('before: ' + this.boardStates.length);
            print(this.boardStates)
            this.boardStates.pop();
            print('after: ' + this.boardStates.length);
            print(this.boardStates)
        }
    }
}