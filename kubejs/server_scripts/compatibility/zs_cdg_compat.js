// ============================================================================
// zs_cdg.js — CDG 配方补充：杂酚油工艺 + 水煤气制柴油
// ----------------------------------------------------------------------------
// 原作者: Ryifer 许可证: CC BY-NC 4.0
// 木材/煤炭热解 → 杂酚油 + 木炭/焦炭（基于 event.custom）
// 炭水共热 + 铁粉催化 → 柴油
// ============================================================================

ServerEvents.recipes(function (event) {

    function cdg(type, ingr, time, res) {
        event.custom({ type: type, ingredients: ingr, processing_time: time, results: res });
    }
	
    // ========================================================================
    // 一、药水和Kaleidoscope酿酒
    // ========================================================================

	// 见kubejs/data/create/recipes/
	
    // ========================================================================
    // 二、杂酚油与焦炭工艺（干馏热解）
    // ========================================================================

    // 2.1 原木 → 木炭 + 杂酚油 30mB
    cdg('createdieselgenerators:basin_fermenting',
        [{ tag: 'minecraft:logs_that_burn' }], 600,
        [{ id: 'minecraft:charcoal' }, { id: 'immersiveengineering:creosote', amount: 250 }]);
    cdg('createdieselgenerators:bulk_fermenting',
        [{ tag: 'minecraft:logs_that_burn' }], 300,
        [{ id: 'minecraft:charcoal' }, { id: 'immersiveengineering:creosote', amount: 250 }]);

    // 2.2 煤炭 → 焦炭 + 杂酚油 30mB
    cdg('createdieselgenerators:basin_fermenting',
        [{ item: 'minecraft:coal' }], 600,
        [{ id: 'immersiveengineering:coal_coke' }, { id: 'immersiveengineering:creosote', amount: 500 }]);
    cdg('createdieselgenerators:bulk_fermenting',
        [{ item: 'minecraft:coal' }], 300,
        [{ id: 'immersiveengineering:coal_coke' }, { id: 'immersiveengineering:creosote', amount: 500 }]);

    // ========================================================================
    // 三、水煤气制柴油（炭水共热 + 铁粉催化）
    // 水煤气变换 + 费托合成 → 柴油
    // ========================================================================

    // 3.1 木炭 + 水 + 铁粉 → 柴油 50mB
    cdg('createdieselgenerators:basin_fermenting',
        [{ item: 'minecraft:charcoal' }, { item: 'immersiveengineering:dust_iron' }, { type: 'fluid_stack', fluid: 'minecraft:water', amount: 200 }], 300,
        [{ id: 'createdieselgenerators:diesel', amount: 100 }, { id: 'immersiveengineering:dust_iron' }]);
    cdg('createdieselgenerators:bulk_fermenting',
        [{ item: 'minecraft:charcoal' }, { item: 'immersiveengineering:dust_iron' }, { type: 'fluid_stack', fluid: 'minecraft:water', amount: 200 }], 150,
        [{ id: 'createdieselgenerators:diesel', amount: 100 }, { id: 'immersiveengineering:dust_iron' }]);

    // ========================================================================
    // 四、冲压统一：CDG compression_molding + IE 模具
    // ========================================================================

    // 移除 CDG 廉价模具切割（改用 IE 蓝图）
    event.remove({ id: 'createdieselgenerators:cutting/bar_mold' });
    event.remove({ id: 'createdieselgenerators:cutting/bowl_mold' });
    event.remove({ id: 'createdieselgenerators:cutting/chain_mold' });
    event.remove({ id: 'createdieselgenerators:cutting/lines_mold' });

    var METALS = [
		'iron','steel','aluminum',
		//'bronze','constantan','invar','lead','nickel','silver','steel','tin','uranium','zinc'
		];
    METALS.forEach(function(m) {
        // 棒：锭 → IE stick
        event.custom({ type: 'createdieselgenerators:compression_molding',
            ingredients: [{ tag: 'c:ingots/' + m }], mold: 'createdieselgenerators:lines',
            results: [{ id: 'immersiveengineering:stick_' + m, count: 2 }] });
        // 板：锭 → IE plate
        /*event.custom({ type: 'createdieselgenerators:compression_molding',
            ingredients: [{ tag: 'c:ingots/' + m }], mold: 'createdieselgenerators:bar',
            results: [{ id: 'immersiveengineering:plate_' + m }] });
        // 线：锭 → IE wire
        event.custom({ type: 'createdieselgenerators:compression_molding',
            ingredients: [{ tag: 'c:ingots/' + m }], mold: 'kubejs:wire',
            results: [{ id: 'immersiveengineering:wire_' + m, count: 2 }] });*/
    });
    var METALS2 = [
		'copper','electrum','gold','brass',
		//'bronze','constantan','invar','lead','nickel','silver','steel','tin','uranium','zinc'
		];
    METALS2.forEach(function(m) {
        // 棒：锭 → CCA stick
        event.custom({ type: 'createdieselgenerators:compression_molding',
            ingredients: [{ tag: 'c:ingots/' + m }], mold: 'createdieselgenerators:lines',
            results: [{ id: 'createaddition:' + m + '_rod', count: 2 }] });
    });

	// 合成树皮
    create.compacting('farmersdelight:tree_bark', [
        Item.of('createdieselgenerators:wood_chip', 2),
        Fluid.of('createdieselgenerators:plant_oil', 50)
    ]);
	// 合成原木 你为什么要这么做
    create.compacting('minecraft:oak_log', [
        Item.of('createdieselgenerators:chip_wood_block', 8),
        Item.of('farmersdelight:tree_bark', 4),
        Fluid.of('createdieselgenerators:plant_oil', 250)
    ]);
});

ServerEvents.tags('item', function (event) {
	// 移除过于廉价的 CDG 木屑木板，迫使转向 IE 纤维板木板
	event.remove('minecraft:planks', 'createdieselgenerators:chip_wood_block');
});
