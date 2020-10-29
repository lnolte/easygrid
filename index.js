(function() {

  var EasyGrid = function(options) {
    this.EVEN = 'even';
    this.state = {
      x:0,
      y:0,
      columns:10,
      columnRatio: this.EVEN,
      rows:1,
      rowRatio: this.EVEN,
      gutterWidth: 0,
      gutterHeight: 0,
      moduleWidth:50,
      moduleHeight:500,
    };
    this.setOptions(options)
  }

  EasyGrid.prototype.setOptions = function(options) {
    var req = Object.assign(this.state, options);

    // calculate the grid ratios
    if(req.columnRatio === this.EVEN) req.columnRatio = new Array(req.columns).fill(1);
    if(req.rowRatio === this.EVEN) req.rowRatio = new Array(req.rows).fill(1);

    if(!req.columnRatio !== this.EVEN && req.width === 'undefined') {
      console.log('You need to provide a width when using a non even column ratio');
      return;
    }

    if(!req.rowRatio !== this.EVEN && req.height === 'undefined') {
      console.log('You need to provide a height when using a non even row ratio');
      return;
    }

    if(req.columnRatio !== this.EVEN && req.columnRatio.length !== req.columns) {
      console.log('Your column ratio length needs to match the number of columns for non even ratios');
      return;
    }

    if(req.rowRatio !== this.EVEN && req.rowRatio.length !== req.rows) {
      console.log('Your row ratio length needs to match the number of row for non even ratios');
      return;
    }

    // if gutter is set, override gutterWidth and gutterHeight
    if(typeof req.gutter !== 'undefined') {
      req.gutterWidth = req.gutter;
      req.gutterHeight = req.gutter;
    }

    // if width is set, override moduleWidth
    if(typeof req.width !== 'undefined') {
      req.moduleWidth = (req.width - ((req.columns-1) * req.gutterWidth)) / req.columns;
    } else {
      req.width = (req.moduleWidth * req.columns) + (req.gutterWidth * (req.columns-1))
    }

    // if height is set, override moduleHeigt
    if(typeof req.height !== 'undefined') {
      req.moduleHeight = (req.height - ((req.rows-1) * req.gutterHeight)) / req.rows;
    } else {
      req.height = (req.moduleHeight * req.rows) + (req.gutterHeight * (req.rows-1))
    }

    this.state = req;
    this.calculateGrid()
  }

  EasyGrid.prototype.calculateGrid = function() {
    this.modules = [];
    // normalize the ratios
    var totalColumnRatio = this.state.columnRatio.reduce((acc, cur) => acc + cur);
    var totalRowRatio = this.state.rowRatio.reduce((acc, cur) => acc + cur);
    this.normalizedColumnRatio = this.state.columnRatio.map((item) => item / totalColumnRatio);
    this.normalizedRowRatio = this.state.rowRatio.map((item) => item / totalRowRatio);

    var totalHeight = 0;

    for(var y = 0; y < this.state.rows; y++) {
      var height = (this.state.height - ((this.state.rows-1) * this.state.gutterHeight)) * this.normalizedRowRatio[y];
      var totalWidth = 0;
      for(var x = 0; x < this.state.columns; x++) {
        var width = (this.state.width - ((this.state.columns-1) * this.state.gutterWidth)) * this.normalizedColumnRatio[x];
        

        this.modules.push({
          x: this.state.x + totalWidth + (x * this.state.gutterWidth),
          y: this.state.y + totalHeight + (y * this.state.gutterHeight),
          width: width,
          height: height
        });

        totalWidth += width;
      }
      totalHeight += height;
    }
  }

  EasyGrid.prototype.getModule = function(column, row){
    var index = (column-1) + ((row-1) * this.state.columns)
    if(this.modules[index]) {
      return this.modules[index]
    }
    else {
      throw new Error('The column or row does not exist');
    }
  }

  // Convenience Functions to get Colspans, Rowspans and Modulespans
  EasyGrid.prototype.colSpan = function(from, to) {
    var startCol = this.getModule(from, 1),
        endCol = this.getModule(to, 1),
        delta = to - from,
        x = startCol.x,
        y = startCol.y,
        w = endCol.x + endCol.width - startCol.x,
        h = this.state.height;

    return {
      x: x,
      y: y,
      width: w,
      height: h,
    };
  }

  EasyGrid.prototype.rowSpan = function(from, to) {
    var startRow = this.getModule(1, from),
        endRow = this.getModule(1, to),
        delta = to - from,
        x = startRow.x,
        y = startRow.y,
        w = this.state.width,
        h = endRow.y + endRow.height - startRow.y;

    return {
      x: x,
      y: y,
      width: w,
      height: h,
    };
  }

  EasyGrid.prototype.moduleSpan = function(fromCol, fromRow, toCol, toRow) {
    var col = this.colSpan(fromCol, toCol);
    var row = this.rowSpan(fromRow, toRow);

    return {
      x: col.x,
      y: row.y,
      width: col.width,
      height: row.height
    };
  }

  // Export for Node.js
  if(typeof module !== 'undefined' && module.exports) {
    module.exports = EasyGrid;
  }
  // Export for browser
  else {
    this.EasyGrid = EasyGrid;
  }

}.call(this));
