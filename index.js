const EVEN = 'even'

class EasyGrid {
  constructor(options) {
    this.state = {
      x:0,
      y:0,
      columns:10,
      columnRatio: EVEN,
      rows:1,
      rowRatio: EVEN,
      gutterWidth: 0,
      gutterHeight: 0,
      moduleWidth:50,
      moduleHeight:500,
    };
    this.setOptions(options)
  }

  setOptions(options) {
    const req = Object.assign(this.state, options);

    if(!req.columnRatio !== EVEN && req.width === 'undefined') {
      throw new Error('You need to provide a width when using a non even column ratio');
    }
    
    if(!req.rowRatio !== EVEN && req.height === 'undefined') {
      throw new Error('You need to provide a height when using a non even row ratio');
    }

    if(req.columnRatio !== EVEN && req.columnRatio.length !== req.columns) {
      throw new Error('Your column ratio length needs to match the number of columns for non even ratios');
    }

    if(req.rowRatio !== EVEN && req.rowRatio.length !== req.rows) {
      throw new Error('Your row ratio length needs to match the number of row for non even ratios');
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

  getColumnRatio() {
    if(this.state.columnRatio === EVEN) return new Array(this.state.columns).fill(1);
    return this.state.columnRatio;
  }

  getRowRatio() {
    if(this.state.rowRatio === EVEN) return new Array(this.state.rows).fill(2);
    return this.state.rowRatio;
  }

  calculateGrid() {
    this.modules = [];
    // normalize the ratios
    const totalColumnRatio = this.getColumnRatio().reduce((acc, cur) => acc + cur);
    const totalRowRatio = this.getRowRatio().reduce((acc, cur) => acc + cur);
    this.normalizedColumnRatio = this.getColumnRatio().map((item) => item / totalColumnRatio);
    this.normalizedRowRatio = this.getRowRatio().map((item) => item / totalRowRatio);

    let totalHeight = 0;
    for(let y = 0; y < this.state.rows; y++) {
      const height = (this.state.height - ((this.state.rows-1) * this.state.gutterHeight)) * this.normalizedRowRatio[y];
      let totalWidth = 0;
      for(let x = 0; x < this.state.columns; x++) {
        const width = (this.state.width - ((this.state.columns-1) * this.state.gutterWidth)) * this.normalizedColumnRatio[x];
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

  getModule(column, row) {
    const index = (column-1) + ((row-1) * this.state.columns)
    if(this.modules[index]) {
      return this.modules[index]
    }
    else {
      throw new Error('The column or row does not exist');
    }
  }

  colSpan(from, to) {
    const startCol = this.getModule(from, 1),
          endCol = this.getModule(to, 1),
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

  rowSpan(from, to) {
    const startRow = this.getModule(1, from),
          endRow = this.getModule(1, to),
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

  moduleSpan(fromCol, fromRow, toCol, toRow) {
    const col = this.colSpan(fromCol, toCol);
    const row = this.rowSpan(fromRow, toRow);

    return {
      x: col.x,
      y: row.y,
      width: col.width,
      height: row.height
    };
  }
}

export default EasyGrid;
