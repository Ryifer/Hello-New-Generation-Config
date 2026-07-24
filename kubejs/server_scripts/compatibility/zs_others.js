// ============================================================================
// zs_others.js — 杂项配方补充（不归类到特定模组的通用调整）
// ----------------------------------------------------------------------------
// 原作者: Ryifer 许可证: CC BY-NC 4.0
// 此文件为本地补充，不修改任何原 kubejs 脚本，方便保持对上游的跟进。
// ============================================================================

ServerEvents.recipes(function (event) {

    var create = event.recipes.create;

    // ========================================================================
    // 一、Kaleidoscope Cookery
    // ========================================================================

    // 1.1 KC 水稻体系补充（野化 + FD 打包）
    // 1.1.1 KC 稻米 → 缠魂 → KC 野生稻米（半驯化返祖）
    create.haunting('kaleidoscope_cookery:wild_rice', 'kaleidoscope_cookery:rice');

    // 1.1.2 KC 稻米 ×9 → FD 米袋（跨模组打包）
    event.shaped('farmersdelight:rice_bag', [
        '###',
        '###',
        '###'
    ], { '#': 'kaleidoscope_cookery:rice' });

	// 1.2. 油脂体系（KC 种子磨油 → CDG 植物油）
	// 1.2.1 种子 → 石磨 → KC油脂 + 25% 油渣（biomass_pellet）
	event.recipes.create.milling('kaleidoscope_cookery:oil', {tag: 'c:seeds'});

	// 1.2.2 KC油脂 → 搅拌加热 → CDG 植物油 125mB
	event.recipes.create.compacting([
		Fluid.of('createdieselgenerators:plant_oil', 125),
		'createaddition:biomass_pellet'
	], 
		'4x kaleidoscope_cookery:oil'
	);
	
	// 1.2.3 蜡烛
    event.shaped('minecraft:candle', [
        's ',
        'o '
    ], { 's': 'minecraft:string', 'o': 'kaleidoscope_cookery:oil' });
	
    // ========================================================================
    // 二、Supplementaries
    // ========================================================================

    // 2.1 亚麻 → 缠魂 → 野生亚麻
    create.haunting('supplementaries:wild_flax', 'supplementaries:flax');
	
	// 2.2 肥皂
	event.custom({
		type: 'minecraft:crafting_shapeless',
		ingredients: [
			{ item: 'minecraft:water_bucket', remainder: { item: 'minecraft:bucket' } },
			{ item: 'supplementaries:ash', count: 4 },
			{ item: 'kaleidoscope_cookery:oil', count: 3 }
		],
		result: { id: 'supplementaries:soap', count: 6 }
	});
    create.mixing(Item.of('supplementaries:soap', 2), [
		Item.of('supplementaries:ash', 1),
		'kaleidoscope_cookery:oil',
		Fluid.of('minecraft:water', 250)]);
    create.mixing(Item.of('supplementaries:soap', 2), [
		Item.of('supplementaries:ash', 1),
		Fluid.of('immersiveengineering:plantoil', 75),
		Fluid.of('minecraft:water', 250)]);

    // 2.4 灰烬合成 — 搅拌加热热解（三级概率：原木25% / 木板12.5% / 木棍6.25%）
    create.mixing([CreateItem.of('supplementaries:ash', 0.25)], Ingredient.of('#minecraft:logs')).heated();
    create.mixing([CreateItem.of('supplementaries:ash', 0.125)], Ingredient.of('#minecraft:planks')).heated();
    create.mixing([CreateItem.of('supplementaries:ash', 0.0625)], 'minecraft:stick').heated();

    // ========================================================================
    // 三、Bakery & Bakeries
    // ========================================================================
	
    //create.mixing(Item.of('bakeries:butter_cube'), Fluid.of('minecraft:milk', 250));
	
    // ========================================================================
	// 四、Beachparty
    // ========================================================================

	// 4.1 干草块 → 泡水 → 湿草块
    create.splashing('beachparty:wet_hay_block', 'minecraft:hay_block');
    event.campfireCooking('minecraft:hay_block', 'beachparty:wet_hay_block');
	
	// 4.2 沙子 → 搅拌 → 沙浪
    create.mixing('beachparty:sandwaves', 'chipped:soft_sand');

    // ========================================================================
	// 五、其他
    // ========================================================================

	// 机械动力造纸工艺，从农夫乐事和沉浸工程转化
    create.compacting('minecraft:paper', [
        Item.of('farmersdelight:tree_bark', 2),
        Fluid.of('minecraft:water', 500)
    ]);
    create.compacting('minecraft:paper', [
        Ingredient.of('#c:dusts/wood', 2),
        Fluid.of('minecraft:water', 500)
    ]);
	
	// 生铁炼钢
    create.compacting(Item.of('createbigcannons:steel_ingot', 2), [
		Item.of('createbigcannons:cast_iron_ingot', 1),
		Item.of('minecraft:iron_ingot', 1)
	]).heated();
	
	// 修复和整理红砖合成表冲突
    event.remove({ id: 'yuushya:stone/smoke_bricks' });
	event.smoking('yuushya:smoke_bricks', 'immersiveengineering:clinker_brick');
    create.splashing('immersiveengineering:clinker_brick', 'yuushya:smoke_bricks');
    
	//event.remove({ id: 'createdeco:cracked_red_bricks_from_bricks_smelting' });
    event.remove({ id: 'cluttered:antique_bricks' });
    event.shaped('4x cluttered:antique_bricks', [
        'AB',
        'BA'
    ], { 'A': 'minecraft:bricks', 'B': 'immersiveengineering:clinker_brick' });
    event.shaped('4x cluttered:antique_bricks', [
        'BA',
        'AB'
    ], { 'A': 'minecraft:bricks', 'B': 'immersiveengineering:clinker_brick' });
});
