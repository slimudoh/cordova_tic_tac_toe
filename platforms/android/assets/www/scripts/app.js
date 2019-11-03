(function(){

    'use strict'

    /**------------------------------------------
     TOP LEVEL ENTITIES
     ----------------------------------------------**/
    var Panel,
        GamePanel,
        ScorePanel,
        Utils,
        Links,
        Game,
        Frames,
        InitialFrame,
        GameFrame,
        EndFrame,
        Turns,
        Player_X = 5,
        Player_O = 7,
        Player_X_text = 'X',
        Player_O_text = 'O',
        gameEngine,
        X_link,
        O_link,
        human_play_val,
        com_play_val,
        continue_link,
        reset_link,
        currentWinner,
        restart_link;

    const GAME = {
        CONTINUE : 0,
        DRAW : 1
    };

    /**------------------------------------------
     GAME INITIALIZER
     ----------------------------------------------**/
    Game = {
        init: function() {
            Links.registerLinks();
            InitialFrame.display();
            GamePanel.setupGamePanel();
            ScorePanel.setupScorePanel();
            gameEngine = new GameEngine()
            gameEngine.init();
        },

        reset: function(){
            GameFrame.hide();
            GamePanel.resetGamePanel();
            ScorePanel.resetScorePanel();
            //ScorePanel.resetScorePanel();
            InitialFrame.display();
            gameEngine.init();

        },

        start_game: function(val) {

            InitialFrame.hide();
            GameFrame.display();

            if (val === 5) {
                human_play_val = Player_X;
                com_play_val = Player_O;
                Turns.human();
            } else {
                human_play_val = Player_O;
                com_play_val = Player_X;
                this.com_play();
            }
        },

        continue_game: function(currentWinner) {
            GamePanel.resetGamePanel();
            EndFrame.hide();
            GameFrame.display();
            gameEngine.init();

            if (currentWinner === human_play_val)
                this.com_play();
        },

        play: function(cell, val) {
            var winDraw,
                availableCells = gameEngine.avCells();

            if (availableCells.indexOf(cell) < 0)
                return;

            winDraw = gameEngine.process(cell, val);
            GamePanel.updateGamePanel(cell, val);

            if (winDraw === GAME.CONTINUE) {
                //Display your turn..
                if (val === human_play_val) {
                    Turns.computer();
                    this.com_play();
                    Turns.human();
                }
            } else {
                if (winDraw === GAME.DRAW) {
                    //It's a Draw..
                    EndFrame.display('It was a tie..');
                }else {
                    //It's a win
                    GamePanel.showWin(winDraw);
                    currentWinner = val;
                    setTimeout(function(){
                        GamePanel.clearWin(winDraw);
                        if (val === com_play_val) {
                            ScorePanel.updateScorePanel(1, 0);
                            EndFrame.display('You lost..');
                            //document.getElementById("win_status").style.color = "red";    
                            document.getElementById("win_status").style.animation = "lose .3s ease-in-out infinite"; 
                            document.getElementById("win_status").style.webkitAnimation = "lose .3s ease-in-out infinite";                            
                        }
                        else {
                            ScorePanel.updateScorePanel(0, 1);
                            EndFrame.display('You won');
                        }
                    }, 400);
                }
            }
        },

        com_play: function() {
            var move = gameEngine.getMove(com_play_val);
            this.play(move, com_play_val);
        }
    };

    Turns = {
        human: function() {
            Utils.selectElementById('turns').innerText = 'Your Turn';
        },
        computer: function() {
            Utils.selectElementById('turns').innerText = "Computer's Turn";
        },
        clearTurn: function(){
            Utils.selectElementById('turns').innerText = '';
        }
    };

    Links = {
        registerLinks: function() {

            X_link = Utils.selectElementById('player-x');
            O_link = Utils.selectElementById('player-o');
            continue_link = Utils.selectElementById('continue_game');
            restart_link = Utils.selectElementById('restart_game');

            reset_link = Utils.selectElementById('reset_game');

            X_link.addEventListener("click", function(){
                Game.start_game(Player_X);
            }, false);

            O_link.addEventListener("click", function(){
                Game.start_game(Player_O);
            }, false);

            restart_link.addEventListener("click", function(){
                Game.reset();
            }, false);

            reset_link.addEventListener("click", function(){
                Game.reset();
            }, false);

            continue_link.addEventListener("click", function(){
                Game.continue_game(currentWinner);
            }, false);
        }
    };

    /**------------------------------------------
     FRAMES
     ----------------------------------------------**/
    Frames = {
        showFrame: function(frame) {
            Utils.selectElementById(frame).style.display = 'block';
        },

        hideFrame: function(frame) {
            Utils.selectElementById(frame).style.display = 'none';
        }
    };

    InitialFrame = Object.create(Frames);
    GameFrame = Object.create(Frames);
    EndFrame = Object.create(Frames);

    InitialFrame.display = function() {
        this.hideFrame('end_frame');
        this.showFrame('initial_frame');
    };

    InitialFrame.hide = function() {
        this.hideFrame('initial_frame');
    };

    GameFrame.display = function() {
        this.showFrame('game_frame');
    };

    GameFrame.hide = function() {
        this.hideFrame('game_frame');
    };

    EndFrame.display = function(info) {
        this.hideFrame('game_frame');
        Utils.selectElementById('win_status').innerText = info;
        this.showFrame('end_frame');
    };

    EndFrame.hide = function() {
        this.hideFrame('end_frame');
    };

    /**----------------------------------------------
     PANELS
     ----------------------------------------------**/
    Panel = {
        setup: function(name){
            this.name = name || 'Panel';
            console.log('Setting Up '+ this.name);
        },

        reset: function(name) {
            this.name = name || 'Panel';
            console.log('Resetting.. '+ this.name);
        },

        update: function(name) {
            this.name = name || 'Panel';
            console.log('Setting Up '+ this.name);
        }
    };

    GamePanel = Object.create(Panel);
    ScorePanel = Object.create(Panel);

    GamePanel.setupGamePanel = function() {
        this.setup('Game Panel');
        var cellsIndex = 9,
            that = this;

        for (var i = 0; i < cellsIndex; i++) {
            //loops + Closures
            (function(){
                var cellName = (i+1)+'-cell',
                    cellElement = Utils.selectElementById(cellName),
                    cellVal = cellElement.innerText,
                    index = i+1;

                cellElement.addEventListener("click", function(){
                    Game.play(index, human_play_val);
                    //that.updateGamePanel(index, Player_X);
                }, false);
            }(i));
        }
    };

    GamePanel.resetGamePanel = function(){
        this.reset('Game Panel');
        var cellsIndex = 9,
            that = this;

        for (var i = 0; i < cellsIndex; i++) {
            //loops + Closures
            (function(){
                var cellName = (i+1)+'-cell-val',
                    cellElement = Utils.selectElementById(cellName);
                cellElement.innerText = '';
            }(i));
        }
    }

    GamePanel.updateGamePanel = function(cellIndex, player) {
        this.update('Game Panel');
        if (player === Player_X) {
            Utils.selectElementById(cellIndex+'-cell-val').innerText = Player_X_text;
        } else {
            Utils.selectElementById(cellIndex+'-cell-val').innerText = Player_O_text;
        }
    };

    GamePanel.showWin = function(cells) {
        for(var i =0; i < cells.length; i++) {
            (function(){
                var cell = cells[i]+'-cell';
                console.log(cell);
                Utils.selectElementById(cell).style.background = 'black';
            })(cells, i);
        }
    };

    GamePanel.clearWin = function(cells) {
        //Show win code goes here
        for(var i =0; i < cells.length; i++) {
            (function(){
                var cell = cells[i]+'-cell';
                console.log(cell);
                Utils.selectElementById(cell).style.background = 'none';
            })(cells, i);
        }
    };

    ScorePanel.setupScorePanel = function () {
        this.setup('Score Panel');
        Utils.selectElementById('comp_score').innerText = '0';
        Utils.selectElementById('human_score').innerText = '0';
    };

    ScorePanel.updateScorePanel = function (comp_score, human_score) {
        this.update('Score Panel');
        var computer_score = parseInt(Utils.selectElementById('comp_score').innerText) + comp_score;
        var human_score = parseInt(Utils.selectElementById('human_score').innerText) + human_score;

        Utils.selectElementById('comp_score').innerText = computer_score;
        Utils.selectElementById('human_score').innerText = human_score;
    };

    ScorePanel.resetScorePanel = function() {
        this.reset('Score Panel');
        Utils.selectElementById('comp_score').innerText = '0';
        Utils.selectElementById('human_score').innerText = '0';
    };

    /**------------------------------------------
     UTILS
     ----------------------------------------------**/
    Utils = {
        cellNumberStripper: function(cellNameWithDashedNumber) {
            return parseInt(cellNameWithDashedNumber);
        },

        selectElementById: function(name) {
            return document.getElementById(name);
        },

        selectElementByClass: function(name) {
            return document.getElementsByClassName(name)[0];
        }

    };

    /**------------------------------------------
     GAME ENGINE
     ----------------------------------------------**/

    function GameEngine(){
        var grid,
            cells_grid,
            availableCells;

        function setUpGameData() {
            grid = {
                first_row : {
                    value : 0,
                    cells : [1, 2, 3]
                },
                second_row : {
                    value : 0,
                    cells : [4, 5, 6]
                },
                third_row : {
                    value : 0,
                    cells : [7, 8, 9]
                },
                first_col : {
                    value : 0,
                    cells : [1, 4, 7]
                },
                second_col : {
                    value : 0,
                    cells : [2, 5, 8]
                },
                third_col : {
                    value : 0,
                    cells : [3, 6, 9]
                },
                left_diag : {
                    value : 0,
                    cells : [1, 5, 9]
                },
                right_diag : {
                    value : 0,
                    cells : [3, 5, 7]
                }
            };

            cells_grid = [
                ['first_row', 'first_col', 'left_diag'],
                ['first_row', 'second_col'],
                ['first_row', 'third_col', 'right_diag'],
                ['second_row', 'first_col'],
                ['second_row', 'second_col', 'left_diag', 'right_diag'],
                ['second_row', 'third_col'],
                ['third_row', 'first_col', 'right_diag'],
                ['third_row', 'second_col'],
                ['third_row', 'third_col', 'left_diag']
            ];

            availableCells = Array.apply(null, {length: 9}).map(function(val, index){
                return index + 1;
            });
        }

        function winLoseDrawChecker(cell, val){
            var res = gameLogic(cell, val);
            if (!res) {
                if (availableCells.length > 0)
                    return 0;
                return 1;
            }
            return res; //Returns the winning grid cells indexes.
        }

        function gameLogic(cell, val) {
            var mappedGrid = cells_grid[cell - 1];
            if (mappedGrid) {
                removeCellFromAvailableCells(cell);
                for (var i =0; i < mappedGrid.length; i++) {
                    if (grid[mappedGrid[i]]) {
                        updateGridValue(mappedGrid[i], val);
                        if (grid[mappedGrid[i]].value === 21 || grid[mappedGrid[i]].value === 15)
                            return grid[mappedGrid[i]].cells;
                        removeRedundantGrid(mappedGrid[i]);
                    }
                }
                return false;
            }
        }

        function removeRedundantGrid(check_grid){
            if (grid.hasOwnProperty(check_grid))
                if (grid[check_grid].value === 17 || grid[check_grid].value === 19)
                    delete grid[check_grid];
        }

        function removeCellFromAvailableCells(cell){
            availableCells.splice(availableCells.indexOf(cell), 1);
        }

        function updateGridValue(grid_to_modify, val) {
            grid[grid_to_modify].value += val;
        }

        function getAvailableCells(){
            return availableCells;
        }

        function getAvailabbleGrids() {
            return grid;
        }

        function generateMove(val) {
            var valueToTest = 14,
                otherValue = 10,
                alternativeGrid,
                potentGrid;

            if (val === 5) {
                valueToTest = 10;
                otherValue = 14;
            }

            for(var i in grid) {
                if (grid[i].value === valueToTest) {
                    potentGrid = grid[i];
                    break;
                }else {
                    if(grid[i].value === otherValue)
                        alternativeGrid = grid[i];
                }
            }

            if (potentGrid) {
                return getCommonEntries(potentGrid.cells, availableCells).shift();
            }

            if (alternativeGrid) {
                return getCommonEntries(alternativeGrid.cells, availableCells).shift();
            }

            var ee = Math.floor((Math.random() * (availableCells.length-1)) + 1);
            console.log(ee);
            return availableCells[ee];
        }

        function getCommonEntries(cells, avCells) {
            return cells.filter(function(val){
                return avCells.indexOf(val) > -1;
            });
        }

        var GameEngine_API = {
            init : setUpGameData,
            process : winLoseDrawChecker,
            avCells : getAvailableCells,
            avGrid : getAvailabbleGrids,
            getMove : generateMove
        }

        return GameEngine_API;
    };

    Game.init();

}());