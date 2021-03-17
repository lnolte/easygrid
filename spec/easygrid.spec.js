import EasyGrid from '../index.js';

describe("EasyGrid", function() {
  let grid;
  beforeEach(function() {
    grid = new EasyGrid({
      x: 10,
      y: 10,
      width: 500,
      height: 500,
      gutter: 10,
      columns: 10,
      rows: 2
    });
  });

  it("should give back correct position of first module", function() {
    const myModule = grid.getModule(1, 1);
    expect(myModule.x).toEqual(10);
    expect(myModule.y).toEqual(10);
    expect(myModule.width).toEqual(41);
    expect(myModule.height).toEqual(245);
  });

  it("should give back correct position of last module", function() {
    const myModule = grid.getModule(10, 2);
    expect(myModule.x).toEqual(469);
    expect(myModule.y).toEqual(265);
    expect(myModule.width).toEqual(41);
    expect(myModule.height).toEqual(245);
  });

  it("should give back a correct colspan", function() {
    const col = grid.colSpan(2, 5);
    expect(col.x).toEqual(61);
    expect(col.y).toEqual(10);
    expect(col.width).toEqual(194);
    expect(col.height).toEqual(500);
  });

  it("should give back a correct rowspan", function() {
    const row = grid.rowSpan(1, 2);
    expect(row.x).toEqual(10);
    expect(row.y).toEqual(10);
    expect(row.width).toEqual(500);
    expect(row.height).toEqual(500);
  });

  it("should give back a correct module size", function() {
    const module = grid.moduleSpan(2, 1, 5, 2);
    expect(module.x).toEqual(61);
    expect(module.y).toEqual(10);
    expect(module.width).toEqual(194);
    expect(module.height).toEqual(500);
  });

  it("should recalculate the grid if new options are passed", function() {
    grid.setOptions({ columns: 4, x: 20, y: 20 });
    const myModule = grid.colSpan(1, 4);
    expect(myModule.x).toEqual(20);
    expect(myModule.y).toEqual(20);
    expect(myModule.width).toEqual(500);
  });

  it("should calculate non-even grids properly", function() {
    grid.setOptions({ columns: 2, columnRatio: [1, 3] });
    const myModule = grid.colSpan(1, 1);
    expect(myModule.width).toEqual(122.5);
    const myModule2 = grid.colSpan(2, 2);
    expect(myModule2.width).toEqual(367.5);
    const fullWidth = grid.colSpan(1, 2);
    expect(fullWidth.width).toEqual(500);
  });

  it("should throw an error if the ratio length does not match column count", function() {
    expect(function() {
      grid.setOptions({ columns: 10, columnRatio: [1, 3, 5] });
    }).toThrow();
  });

  it("should throw an error if the ratio length does not match row count", function() {
    expect(function() {
      grid.setOptions({ rows: 10, rowRatio: [1, 3, 5] });
    }).toThrow();
  });

});
