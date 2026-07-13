// ============================================================================
// local/bop_compat.js — BOP × Create × Farmer's Delight 兼容
// ----------------------------------------------------------------------------
// 原作者: Ryifer 许可证: CC BY-NC 4.0
// 此文件为本地补充，不修改任何原 kubejs 脚本，方便保持对上游的跟进。
// ============================================================================

ServerEvents.recipes(function (event) {

    var create = event.recipes.create;

    // ========================================================================
    // 一、BOP 特色材料 → Create 加工链
    // ========================================================================

	// 1.1 沙子合成和加工路线
	// 见kubejs/server_scripts/specialized/zs_sand.js

	// 1.2 血肉
    // 1.2.1 血肉块粉碎
    create.crushing([
        Item.of('minecraft:rotten_flesh', 4),
        CreateItem.of('minecraft:bone_meal', 0.5)
    ], 'biomesoplenty:flesh').processingTime(200);
    create.milling([
        Item.of('minecraft:rotten_flesh', 3),
        Item.of('minecraft:bone_meal', 1)
    ], 'biomesoplenty:flesh').processingTime(200);
    create.milling(
        Item.of('minecraft:rotten_flesh', 3),
		'biomesoplenty:porous_flesh').processingTime(200);
    // 1.2.2 血肉块合成
    create.mixing('biomesoplenty:flesh', [
        Item.of('minecraft:rotten_flesh', 4),
        Fluid.of('biomesoplenty:blood', 250)
    ]);
    // 1.2.3 肉类压榨出血
    create.compacting(Fluid.of('biomesoplenty:blood', 250), [Ingredient.of('#c:raw_meats', 1)]).heated();
    create.compacting(Fluid.of('biomesoplenty:blood', 250), Item.of('minecraft:rotten_flesh', 2)).heated();
    // 1.2.4 多孔肉块及其他杂物合成
    create.haunting([
		'biomesoplenty:porous_flesh',
		CreateItem.of('biomesoplenty:flesh_tendons', 0.25),
		CreateItem.of('biomesoplenty:hair', 0.125)
	], 'biomesoplenty:flesh');
	create.filling(
		Item.of('biomesoplenty:pus_bubble', 4)
	, [Item.of('biomesoplenty:flesh'),
		Fluid.of('biomesoplenty:blood', 250)
	]);
    create.compacting(Fluid.of('biomesoplenty:blood', 75), 'biomesoplenty:pus_bubble');
	create.filling(
		'biomesoplenty:eyebulb'
	, [Item.of('biomesoplenty:pus_bubble'),
		Fluid.of('biomesoplenty:blood', 125)
	]);
	
    // 1.3 热力方解石：方解石 + 岩浆热液沉淀
    create.mixing(Item.of('biomesoplenty:thermal_calcite', 2), [
        'minecraft:calcite',
        Fluid.of('minecraft:lava', 250)
    ]).heated();

	// 1.4 硫磺石
    // 1.4.1 硫磺石 → 硫磺粉（矿石提纯）
    create.milling(
        CreateItem.of('immersiveengineering:dust_sulfur', 0.75),
        'biomesoplenty:brimstone'
    ).processingTime(200);
    // 1.4.2 硫磺粉 + 沙砾 → 压块 → 硫磺石
    create.compacting('biomesoplenty:brimstone', [
        'minecraft:gravel',
        '3x immersiveengineering:dust_sulfur'
    ]);

    // ========================================================================
    // 二、BOP 植物转化体系（烟熏 / 缠魂 / 搅拌 / 手搓）
    // ========================================================================

    // 2.1 烟熏 → 枯萎/干旱
    event.smoking('biomesoplenty:dead_grass', 'minecraft:short_grass');
    //event.smoking('biomesoplenty:tundra_shrub', 'minecraft:tall_grass');
    //event.smoking('biomesoplenty:desert_grass', 'biomesoplenty:dead_grass');
    event.smoking('minecraft:dead_bush', 'biomesoplenty:bush');

    // 2.2 搅拌 → 沙化
    //create.mixing('biomesoplenty:dune_grass',
    //     ['biomesoplenty:dead_grass', 'minecraft:sand']);

    // 2.3 缠魂 → 苔藓变异
    create.haunting('biomesoplenty:glowing_moss_block', 'minecraft:moss_block');
    create.haunting('biomesoplenty:glowing_moss_carpet', 'minecraft:moss_carpet');

    // 2.4 缠魂 → 水生变异
    create.haunting('biomesoplenty:watergrass', 'minecraft:seagrass');

    // 2.5 缠魂 → 退化
    create.haunting('biomesoplenty:bush', 'minecraft:oak_sapling');
    //create.haunting('biomesoplenty:spanish_moss', 'minecraft:vine');

    // 2.6 缠魂 → 蘑菇三级路线
    //     先移除 Create 原有：主世界 → 下界的直接转化
    event.remove({ id: 'create:haunting/crimson_fungus' });
    event.remove({ id: 'create:haunting/warped_fungus' });
    //     主世界 → BOP
    create.haunting('biomesoplenty:glowshroom', 'minecraft:red_mushroom');
    create.haunting('biomesoplenty:toadstool', 'minecraft:brown_mushroom');
    //     BOP → 下界
    //create.haunting('minecraft:crimson_fungus', 'biomesoplenty:glowshroom');
    //create.haunting('minecraft:warped_fungus', 'biomesoplenty:toadstool');

    // 2.7 手搓合成（装饰植物）
    event.shapeless(Item.of('biomesoplenty:clover', 2),
        ['minecraft:short_grass', 'minecraft:green_dye']);
    event.shaped('biomesoplenty:huge_clover_petal', [
        '##',
        '##'
    ], { '#': 'biomesoplenty:clover' });
	// 暂时禁用
    //event.shapeless(Item.of('biomesoplenty:white_petals', 2),
    //    ['minecraft:bone_meal', 'minecraft:white_dye']);
    //event.shapeless('biomesoplenty:wildflower',
    //    ['minecraft:dandelion', 'minecraft:oxeye_daisy']);
    event.stonecutting(Item.of('biomesoplenty:tiny_cactus', 2),
        'minecraft:cactus');
});



// ============================================================================
// 三、标签统一
// ============================================================================
ServerEvents.tags('item', function (event) {

    // 3.1 大麦 → 谷物 / 通用食材
    event.add('c:crops/grain', 'biomesoplenty:barley');
    event.add('c:foods', 'biomesoplenty:barley');

    // 3.2 BOP 蘑菇 → 通用食材
    event.add('c:foods', 'biomesoplenty:toadstool');
    event.add('c:foods', 'biomesoplenty:glowshroom');

    // 3.3 白砂 → 无色砂标签（可用于 Create 砂纸）
    event.add('c:sands/colorless', 'biomesoplenty:white_sand');

    // 3.4 玫瑰石英碎块
    //     不加入 c:gems/quartz（保持与下界石英区分）
	
	// 并入chipped蜘蛛网以获得合成方法
	event.add('chipped:cobweb', 'biomesoplenty:hanging_cobweb');
	event.add('chipped:cobweb', 'biomesoplenty:webbing');
});
