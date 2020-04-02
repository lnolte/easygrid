describe("EasyGrid", function() {

  var EasyGrid = require('../index');
  var grid;
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
    var myModule = grid.getModule(1, 1);
    expect(myModule.x).toEqual(10);
    expect(myModule.y).toEqual(10);
    expect(myModule.width).toEqual(41);
    expect(myModule.height).toEqual(245);
  });

  it("should give back correct position of last module", function() {
    var myModule = grid.getModule(10, 2);
    expect(myModule.x).toEqual(469);
    expect(myModule.y).toEqual(265);
    expect(myModule.width).toEqual(41);
    expect(myModule.height).toEqual(245);
  });

  it("should give back a correct colspan", function() {
    var col = grid.colSpan(2, 5);
    expect(col.x).toEqual(61);
    expect(col.y).toEqual(10);
    expect(col.width).toEqual(194);
    expect(col.height).toEqual(500);
  });

  it("should give back a correct rowspan", function() {
    var row = grid.rowSpan(1, 2);
    expect(row.x).toEqual(10);
    expect(row.y).toEqual(10);
    expect(row.width).toEqual(500);
    expect(row.height).toEqual(500);
  });

  it("should give back a correct module size", function() {
    var module = grid.moduleSpan(2, 1, 5, 2);
    expect(module.x).toEqual(61);
    expect(module.y).toEqual(10);
    expect(module.width).toEqual(194);
    expect(module.height).toEqual(500);
  });

});
