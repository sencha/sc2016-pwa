describe('Ext.d3.axis.Color', function () {

    if (Ext.isIE8 || Ext.isIE9 || Ext.isIE10) {
        return;
    }

    describe('scale', function () {
        it('autocalculate the domain', function () {
            var store = new Ext.data.Store({
                    data: [
                        {test: 4},
                        {test: 5},
                        {test: 6},
                        {test: 7},
                        {test: 8}
                    ]
                }),
                axis = new Ext.d3.axis.Color({
                    field: 'test',
                    scale: {
                        type: 'linear',
                        range: ['#ff0000', '#00ff00', '#0000ff']
                    }
                });
            
            axis.setDomainFromData(store.getRange());
            expect(axis.getColor(0)).toBe('#ff0000');
            expect(axis.getColor(4)).toBe('#ff0000');
            expect(axis.getColor(6)).toBe('#00ff00');
            expect(axis.getColor(8)).toBe('#0000ff');
            expect(axis.getColor(10)).toBe('#0000ff');

            Ext.destroy(axis, store);
        });
        it('should allow for custom domains', function () {
            var store = new Ext.data.Store({
                    data: [
                        {test: 4},
                        {test: 5},
                        {test: 6},
                        {test: 7}
                    ]
                }),
                axis = new Ext.d3.axis.Color({
                    field: 'test',
                    scale: {
                        type: 'linear',
                        domain: [0, 5, 10],
                        range: ['#ff0000', '#00ff00', '#0000ff']
                    }
                });

            axis.setDomainFromData(store.getRange());
            expect(axis.getColor(0)).toBe('#ff0000');
            expect(axis.getColor(4)).not.toBe('#ff0000');
            expect(axis.getColor(5)).toBe('#00ff00');
            expect(axis.getColor(7)).not.toBe('#0000ff');
            expect(axis.getColor(10)).toBe('#0000ff');

            Ext.destroy(axis, store);
        });
    });

});
