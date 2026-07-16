// ============================================================================
// zs_chipped.js — Chipped 沙/砾/魂沙 加工路线
// ----------------------------------------------------------------------------
// 原作者: Ryifer 许可证: CC BY-NC 4.0
// 为 chipped 的 12 种砂、7 种砂砾、13 种灵魂沙各配一条 Create 加工路线，
// 替代纯装饰性的工作台互换。
// ============================================================================

ServerEvents.recipes(function (event) {

    var create = event.recipes.create;

    // ========================================================================
    // 一、沙砾和沙子变种
    // ========================================================================

	// 见kubejs/server_scripts/specialized/zs_sand.js

    // ========================================================================
    // 二、木桶体系（18 种）— 按材质分类加工
    // ========================================================================

    // 2.1 木桶 → 切割 → 对应木板
    /*var WOOD_BARRELS = [
        ['acacia_barrel',       'minecraft:acacia_planks',      4],
        ['birch_barrel',        'minecraft:birch_planks',       4],
        ['oak_barrel',          'minecraft:oak_planks',         4],
        ['spruce_barrel',       'minecraft:spruce_planks',      4],
        ['bamboo_barrel',       'minecraft:bamboo_planks',      4],
        ['mangrove_brick_barrel','minecraft:mangrove_planks',   4],
        ['mangrove_tile_barrel','minecraft:mangrove_planks',    4],
        ['crimson_barrel',      'minecraft:crimson_planks',     4],
        ['varnished_barrel',    'minecraft:oak_planks',         4]  // 清漆桶→橡木板
    ];
    WOOD_BARRELS.forEach(function(b) {
        event.stonecutting(Item.of(b[1], b[2]), 'chipped:' + b[0]);
    });*/

    // 2.2 木桶合成：原版桶 + 对应木板包裹
    var BARREL_CRAFT = [
        ['oak_barrel',           'minecraft:oak_planks',           'minecraft:oak_slab'],
        //['gilded_barrel',      'minecraft:dark_oak_planks',      'minecraft:dark_oak_slab'],
        //['dark_oak_barrel',    'minecraft:dark_oak_planks',      'minecraft:dark_oak_slab'],
        ['birch_barrel',         'minecraft:birch_planks',         'minecraft:birch_slab'],
        ['spruce_barrel',        'minecraft:spruce_planks',        'minecraft:spruce_slab'],
        //['jungle_barrel',      'minecraft:jungle_planks',        'minecraft:jungle_slab'],
        ['acacia_barrel',        'minecraft:acacia_planks',        'minecraft:acacia_slab'],
        ['crimson_barrel',       'minecraft:crimson_planks',       'minecraft:crimson_slab'],
        ['mushroom_barrel',      'minecraft:warped_planks',        'minecraft:warped_slab'],
        ['bamboo_barrel',        'minecraft:bamboo_planks',        'minecraft:bamboo_slab'],
        ['mangrove_brick_barrel','minecraft:mangrove_planks',      'minecraft:mangrove_slab'],
		
        ['varnished_barrel','#immersiveengineering:treated_wood','#immersiveengineering:treated_wood_slab']
    ];
    BARREL_CRAFT.forEach(function(b) {
        event.shaped('chipped:' + b[0], [
            'PSP',
            'P P',
            'PSP'
        ], { P: b[1], S: b[2] });
    });
    // 特殊木桶（不同形状/材料）
    event.shapeless('chipped:mangrove_brick_barrel', 'chipped:mangrove_tile_barrel');
    event.shapeless('chipped:mangrove_tile_barrel', 'chipped:mangrove_brick_barrel');

    event.shaped('chipped:gilded_barrel', [
		'PSP',
		'PGP',
		'PSP'
	], { P: 'minecraft:dark_oak_planks', S: 'minecraft:dark_oak_slab', G: 'minecraft:gold_ingot'});

    event.remove({ id: 'createdieselgenerators:crushing/wood_chip_barrels' });
    create.crushing([
        Item.of('createdieselgenerators:wood_chip', 55),
        CreateItem.of('createdieselgenerators:wood_chip', 0.5)
    ], Ingredient.of('#c:barrels/wooden'));
	
    // ========================================================================
    // 三、板条箱体系（29 种）
    // ========================================================================

    // 3.1 简易板条箱
    var SIMPLE_CRATES = [
        ['acacia_crate',  'minecraft:acacia_planks',  6],
        ['birch_crate',   'minecraft:birch_planks',   6],
        ['crimson_crate', 'minecraft:crimson_planks', 6],
        ['dark_oak_crate','minecraft:dark_oak_planks',6],
        ['jungle_crate',  'minecraft:jungle_planks',  6],
        ['mangrove_crate','minecraft:mangrove_planks',6],
        ['oak_crate',     'minecraft:oak_planks',     6],
        ['spruce_crate',  'minecraft:spruce_planks',  6],
        ['warped_crate',  'minecraft:warped_planks',  6]
    ];
    //SIMPLE_CRATES.forEach(function(c) {
    //    event.stonecutting(Item.of(c[1], c[2]), 'chipped:' + c[0]);
    //});
    SIMPLE_CRATES.forEach(function(c) {
        event.shaped('chipped:' + c[0], [
            'WSW',
            'S S',
            'WSW'
        ], { W: c[1], S: 'minecraft:stick' });
    });
	
    create.crushing([
        Item.of('createdieselgenerators:wood_chip', 39),
        CreateItem.of('createdieselgenerators:wood_chip', 0.5)
    ], Ingredient.of('#c:crate_simple/wooden', 1));

    // 3.2 加强板条箱
    var REINFORCED_CRATES = [
        ['reinforced_acacia_crate',  'minecraft:acacia_planks'],
        ['reinforced_birch_crate',   'minecraft:birch_planks'],
        ['reinforced_crimson_crate', 'minecraft:crimson_planks'],
        ['reinforced_dark_oak_crate','minecraft:dark_oak_planks'],
        ['reinforced_jungle_crate',  'minecraft:jungle_planks'],
        ['reinforced_mangrove_crate','minecraft:mangrove_planks'],
        ['reinforced_oak_crate',     'minecraft:oak_planks'],
        ['reinforced_spruce_crate',  'minecraft:spruce_planks'],
        ['reinforced_warped_crate',  'minecraft:warped_planks']
    ];
    //REINFORCED_CRATES.forEach(function(c) {
    //    event.stonecutting(Item.of(c[1], 6), 'chipped:' + c[0]);
    //    create.mixing(Item.of('minecraft:iron_nugget', 4), 'chipped:' + c[0]);
    //});
    REINFORCED_CRATES.forEach(function(c) {
        event.shaped('chipped:' + c[0], [
            ' S ',
            'SCS',
            ' S '
        ], { S: 'minecraft:stick', C: 'chipped:' + c[0].replace('reinforced_', '') });
    });
	
    create.crushing([
        Item.of('createdieselgenerators:wood_chip', 47),
        CreateItem.of('createdieselgenerators:wood_chip', 0.5)
    ], Ingredient.of('#c:crate_reinforced/wooden', 1));
	

	// ========================================================================
	// 四、滴水石锥 → 石材
	// ========================================================================

	// 4.1 滴水石锥 → 石材（4:1 无序列合成）
	var DRIPSTONE = [
		['andesite_pointed_dripstone',  'minecraft:andesite'],
		['basalt_pointed_dripstone',    'minecraft:basalt'],
		['blackstone_pointed_dripstone','minecraft:blackstone'],
		['calcite_pointed_dripstone',   'minecraft:calcite'],
		['deepslate_pointed_dripstone', 'minecraft:deepslate'],
		['diorite_pointed_dripstone',   'minecraft:diorite'],
		['endstone_pointed_dripstone',  'minecraft:end_stone'],
		['granite_pointed_dripstone',   'minecraft:granite'],
		['netherrack_pointed_dripstone','minecraft:netherrack'],
		['packed_ice_pointed_dripstone','minecraft:packed_ice'],
		['smooth_basalt_pointed_dripstone','minecraft:smooth_basalt'],
		['stone_pointed_dripstone',     'minecraft:stone'],
		['tuff_pointed_dripstone',      'minecraft:tuff'],
	];
	DRIPSTONE.forEach(function(e) {
		event.shapeless(e[1], ['4x chipped:' + e[0]]);
	});

	// 4.2 滴水石锥合成 — 注液器注液结晶（水500mB / 熔岩250mB）
	var DRIPSTONEA = [
		['andesite_pointed_dripstone',  'minecraft:andesite'],
		['basalt_pointed_dripstone',    'minecraft:basalt'],
		['calcite_pointed_dripstone',   'minecraft:calcite'],
		['diorite_pointed_dripstone',   'minecraft:diorite'],
		['endstone_pointed_dripstone',  'minecraft:end_stone'],
		['packed_ice_pointed_dripstone','minecraft:packed_ice'],
		['stone_pointed_dripstone',     'minecraft:stone'],
		['tuff_pointed_dripstone',      'minecraft:tuff'],
	];
	DRIPSTONEA.forEach(function(e) {
		create.filling('chipped:' + e[0], [e[1], Fluid.of('minecraft:water', 500)]);
	});
	create.filling('minecraft:pointed_dripstone', ['minecraft:dripstone_block', Fluid.of('minecraft:water', 500)]);
	var DRIPSTONEB = [
		['basalt_pointed_dripstone',    'minecraft:basalt'],
		['blackstone_pointed_dripstone','minecraft:blackstone'],
		['deepslate_pointed_dripstone', 'minecraft:deepslate'],
		['diorite_pointed_dripstone',   'minecraft:diorite'],
		['granite_pointed_dripstone',   'minecraft:granite'],
		['netherrack_pointed_dripstone','minecraft:netherrack'],
		['smooth_basalt_pointed_dripstone','minecraft:smooth_basalt'],
	];
	DRIPSTONEB.forEach(function(e) {
		create.filling('chipped:' + e[0], [e[1], Fluid.of('minecraft:lava', 250)]);
	});

	// ========================================================================
	// 五、灯扩展 — 移出 chipped 互转 + 海晶灯合成
	// ========================================================================

	/*var WHITE_LAMPS = [
		'edged_white_redstone_lamp',
		'fancy_white_redstone_lamp',
		'hived_white_redstone_lamp',
		'inlayed_white_redstone_lamp',
		'nice_white_redstone_lamp',
		'ornate_white_redstone_lamp',
		'reinforced_white_redstone_lamp',
		'smooth_white_redstone_lamp',
		'thick_white_inlayed_redstone_lamp',
	];
	WHITE_LAMPS.forEach(function(e) {
		create.crushing([
			Item.of('createdieselgenerators:wood_chip', 47),
			CreateItem.of('createdieselgenerators:wood_chip', 0.5)
		], Ingredient.of(e));
	});

	// 海晶灯替代萤石 → 白色精妙红石灯
	event.shaped('chipped:nice_white_redstone_lamp', [
		' R ',
		'RSR',
		' R '
	], { R: 'minecraft:redstone', S: 'minecraft:sea_lantern' });*/
	
	event.shaped('chipped:glowstone_lantern', [
		' R ',
		'RSR',
		' R '
	], { R: 'minecraft:iron_nugget', S: 'minecraft:glowstone' });

	event.shaped('chipped:shroomlight_lantern', [
		' R ',
		'RSR',
		' R '
	], { R: 'minecraft:iron_nugget', S: 'minecraft:shroomlight' });

});


// ========================================================================
// 六、移除 chipped 标签中的沙/砾/魂沙变种（禁用工作台切换）
// ========================================================================
ServerEvents.tags('item', function (event) {

    var BARRELS = ['acacia_barrel','bamboo_barrel','birch_barrel','oak_barrel','spruce_barrel',
                   'crimson_barrel','mushroom_barrel',
                   'mangrove_brick_barrel','mangrove_tile_barrel',
				   'varnished_barrel','gilded_barrel'];
    BARRELS.forEach(function(b) {
		event.remove('chipped:barrel', 'chipped:' + b);
		event.add('c:barrels', 'chipped:' + b);
		event.add('c:barrels/wooden', 'chipped:' + b);
	});

    var BARRELS2 = ['metal_barrel','netherite_safe'];
    BARRELS2.forEach(function(b) { event.remove('chipped:barrel', 'chipped:' + b); });
	
    // 板条箱 从 chipped:barrel 移除
    var CRATES = ['acacia_crate','birch_crate','crimson_crate','dark_oak_crate',
                  'jungle_crate','mangrove_crate','oak_crate','spruce_crate','warped_crate'];
    CRATES.forEach(function(c) {
		event.remove('chipped:barrel', 'chipped:' + c);
		event.add('c:crate', 'chipped:' + c);
		event.add('c:crate_simple', 'chipped:' + c);
		event.add('c:crate_simple/wooden', 'chipped:' + c);
	});
    var CRATES2 = ['reinforced_acacia_crate','reinforced_birch_crate','reinforced_crimson_crate',
                  'reinforced_dark_oak_crate','reinforced_jungle_crate','reinforced_mangrove_crate',
                  'reinforced_oak_crate','reinforced_spruce_crate','reinforced_warped_crate'];
    CRATES2.forEach(function(c) {
		event.remove('chipped:barrel', 'chipped:' + c);
		event.add('c:crate', 'chipped:' + c);
		event.add('c:crate_reinforced', 'chipped:' + c);
		event.add('c:crate_reinforced/wooden', 'chipped:' + c);
	});
	
	// 白色红石灯 — 移出 chipped:redstone_lamp，加入 chipped:white_redstone_lamp
	var WHITE_LAMPS = [
		'edged_white_redstone_lamp',
		'fancy_white_redstone_lamp',
		'hived_white_redstone_lamp',
		'inlayed_white_redstone_lamp',
		'nice_white_redstone_lamp',
		'ornate_white_redstone_lamp',
		'reinforced_white_redstone_lamp',
		'smooth_white_redstone_lamp',
		'thick_white_inlayed_redstone_lamp',
	];
	WHITE_LAMPS.forEach(function(l) {
		event.remove('chipped:redstone_lamp', 'chipped:' + l);
		event.add('chipped:white_redstone_lamp', 'chipped:' + l);
	});
	// 从supplementaries引入白色红石灯
	event.add('chipped:white_redstone_lamp', 'supplementaries:redstone_illuminator');
		
	// 萤石灯笼和菌光体灯笼
	var LANTERNS = [
		'edged_',
		'fancy_',
		'framed_',
		'ornate_',
		'',
	];
	LANTERNS.forEach(function(l) {
		event.remove('chipped:glowstone', 'chipped:' + l + 'glowstone_lantern');
		event.add('chipped:glowstone_lantern', 'chipped:' + l + 'glowstone_lantern');
		event.remove('chipped:shroomlight', 'chipped:' + l + 'shroomlight_lantern');
		event.add('chipped:shroomlight_lantern', 'chipped:' + l + 'shroomlight_lantern');
	});
});

