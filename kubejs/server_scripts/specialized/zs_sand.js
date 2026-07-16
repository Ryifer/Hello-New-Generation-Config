// ============================================================================
// zs_sand.js — 砾沙体系
// ----------------------------------------------------------------------------
// 原作者: Ryifer 许可证: CC BY-NC 4.0
// 标准化和合理化 沙砾-沙子
// ============================================================================

ServerEvents.recipes(function (event) {

    var create = event.recipes.create;

    // ========================================================================
    // 一、BOP 特色材料 → Create 加工链
    // ========================================================================
	// 黑沙 石英+炭
	// 褐沙 石英+金
	// 红沙 金
	// 橙沙 粘土和石英
	// 黄沙 粘土
	// 白沙 石英

    // 5.1.1 黑砂 → 粉碎（玄武岩质火山砂）
    create.crushing('biomesoplenty:black_sand', 'minecraft:basalt').processingTime(200);
    // 5.1.2 安山岩 → 粉碎 → 黑砂（暗色火山矿物→黑色砂）
    /*create.crushing([
        CreateItem.of('biomesoplenty:black_sand', 0.5),
        CreateItem.of('minecraft:sand', 0.5)
    ], 'minecraft:andesite').processingTime(200);*/

    // 5.2.1 橙砂 → 搅拌（红白混合）
    create.mixing(Item.of('biomesoplenty:orange_sand', 2),
        ['minecraft:red_sand', 'biomesoplenty:white_sand']);
    // 5.2.2 陶瓦 → 粉碎 → 橙砂 + 25% 粘土
    event.remove({ id: 'create:milling/terracotta' });
    create.crushing([
        Item.of('biomesoplenty:orange_sand'),
        CreateItem.of('minecraft:clay_ball', 0.25)
    ], 'minecraft:terracotta').processingTime(200);
	
    // 5.3.1 白砂 → 粉碎（石英碎屑）
    create.crushing('biomesoplenty:white_sand', 'minecraft:quartz_block').processingTime(200);
    // 5.3.2 闪长岩 → 粉碎 → 白沙
    /*create.crushing([
        Item.of('biomesoplenty:white_sand'), // 危险的设计
    ], 'minecraft:diorite').processingTime(200);*/

    // 5.4 黑砂水洗（参考灵魂沙 4×12.5% 石英 + 5% 镍粒）
    create.splashing([
        CreateItem.of('4x minecraft:iron_nugget', 0.125),
        CreateItem.of('immersiveengineering:nugget_nickel', 0.05),
        CreateItem.of('minecraft:black_dye', 0.05) // 其实是炭
    ], 'biomesoplenty:black_sand');

    // 5.5 橙砂水洗（红沙与白沙的平均值：粘土 + 石英）
    create.splashing([
        CreateItem.of('2x minecraft:gold_nugget', 0.125),
        // CreateItem.of('2x minecraft:quartz', 0.125)
    ], 'biomesoplenty:orange_sand');

    // 5.6 白砂水洗（富石英砂，4×25%）
    create.splashing([
        CreateItem.of('4x minecraft:quartz', 0.25)
    ], 'biomesoplenty:white_sand');

    // ========================================================================
    // 二、Chipped沙体系（12 种）
    // ========================================================================

    // 1.1 灰沙：沙 + 玄武岩 → 粉碎
    //create.crushing('chipped:ash_sand', 'chipped:dusty_gravel').processingTime(200);
    create.mixing('chipped:ash_sand', ['biomesoplenty:black_sand', 'supplementaries:ash']);
    create.splashing('biomesoplenty:black_sand', 'chipped:ash_sand');

    // 1.2 粗沙：沙 + 沙砾 → 搅拌
    create.mixing('chipped:coarse_sand', 'chipped:sandy_gravel');

    // 1.3 荒漠砂：沙 → 加热搅拌（高温干燥）
    create.mixing('chipped:desert_sand', 'minecraft:sand').heated();

    // 1.4 海藻砂：沙 + 海带 → 搅拌
    create.mixing(Item.of('chipped:kelp_sand', 2), ['minecraft:sand', 'minecraft:kelp']);
    create.splashing(CreateItem.of('minecraft:kelp', 0.35), 'chipped:kelp_sand');

    // 1.5 繁茂红砂：红沙 + 苔藓块 → 搅拌
    create.mixing(Item.of('chipped:lush_red_sand', 2), ['minecraft:red_sand', 'minecraft:moss_block']);
    create.splashing(CreateItem.of('minecraft:moss_block', 0.35), 'chipped:lush_red_sand');

    // 1.6 覆生砂：沙 + 苔藓块 → 搅拌
    create.mixing(Item.of('chipped:overgrown_sand', 2), ['minecraft:sand', 'minecraft:moss_block']);
    create.splashing(CreateItem.of('minecraft:moss_block', 0.35), 'chipped:overgrown_sand');

    // 1.7 珠砂：沙 + 石英 → 搅拌
    create.crushing('chipped:pearl_sand', 'minecraft:prismarine').processingTime(200);

    // 1.8 软沙：沙 → 石磨
    create.milling('chipped:soft_sand', 'minecraft:sand').processingTime(150);

    // 1.9 油沙：沙 + 煤炭 → 搅拌
    create.mixing('chipped:tar_sand', [Ingredient.of('#c:sands', 1), Fluid.of('createdieselgenerators:crude_oil', 150)]).heated();
    create.compacting(['biomesoplenty:black_sand', Fluid.of('createdieselgenerators:crude_oil', 125)], 'chipped:tar_sand');
	
    create.compacting(Item.of('createdieselgenerators:asphalt_block', 4), [
		Item.of('chipped:tar_sand', 2),
		Ingredient.of('#c:gravels', 2)]);

    // 1.10 湿沙：沙 + 水 → 搅拌
    create.mixing('chipped:wet_sand', ['minecraft:sand', Fluid.of('minecraft:water', 125)]);
    event.campfireCooking('minecraft:sand', 'chipped:wet_sand');

    // 1.11 湿红沙：红沙 + 水 → 搅拌
    create.mixing('chipped:wet_red_sand', ['minecraft:red_sand', Fluid.of('minecraft:water', 125)]);
    event.campfireCooking('minecraft:red_sand', 'chipped:wet_red_sand');

    // 1.12 白沙（泛黄） → BOP 已有 white_sand，此处禁用
    //create.mixing('chipped:white_sand', ['minecraft:sand', 'minecraft:bone_meal']);

    // ========================================================================
    // 三、Chipped砂砾体系（7 种）
    // ========================================================================

    // 2.4 橙色/花岗砂砾：沙砾 + 铁粒 → 搅拌（铁染）
    //create.mixing('chipped:orange_gravel', ['minecraft:gravel', 'minecraft:iron_nugget']);
    create.milling([
        Item.of('chipped:orange_gravel'),
        CreateItem.of('minecraft:quartz', 0.125),
    ], 'minecraft:granite').processingTime(200);
    create.crushing([
        Item.of('minecraft:red_sand'),
        CreateItem.of('minecraft:quartz', 0.25),
    ], 'chipped:orange_gravel').processingTime(200);

    // 2.5 粗糙/闪长/大理砂砾：沙砾 → 粉碎（保持粗糙）
    //create.crushing('chipped:rought_gravel', 'minecraft:gravel').processingTime(100);
    create.milling([
        Item.of('chipped:rought_gravel'),
        CreateItem.of('minecraft:quartz', 0.125),
    ], 'minecraft:diorite').processingTime(200);
    create.milling([
        Item.of('minecraft:gravel'),
        CreateItem.of('minecraft:quartz', 0.125),
    ], 'chipped:rought_gravel').processingTime(200);
    create.crushing([
        Item.of('minecraft:sand'),
        CreateItem.of('minecraft:flint', 0.10),
        CreateItem.of('minecraft:quartz', 0.125)
    ], 'chipped:rought_gravel').processingTime(200);
	
    // 2.1 安山砂砾：安山岩 + 沙砾 → 粉碎
    //create.crushing('chipped:andesite_gravel', 'minecraft:andesite').processingTime(200);
    create.milling([
        Item.of('chipped:andesite_gravel'),
        CreateItem.of('minecraft:quartz', 0.125),
    ], 'minecraft:andesite').processingTime(200);
    create.crushing([
        Item.of('minecraft:sand'),
        CreateItem.of('minecraft:flint', 0.10),
        CreateItem.of('minecraft:quartz', 0.05)
    ], 'chipped:andesite_gravel').processingTime(200);

    // 2.3 积尘砂砾：沙砾 → 石磨（磨去棱角）
    create.mixing('chipped:dusty_gravel', ['minecraft:gravel', 'supplementaries:ash']);
    create.splashing('minecraft:gravel', 'chipped:dusty_gravel');

    // 2.2 富壤砂砾：沙砾 + 泥土 → 搅拌
	event.shapeless(Item.of('chipped:dirty_gravel', 2), [
		'minecraft:dirt',
		'minecraft:gravel']);
    //create.mixing(Item.of('chipped:dirty_gravel', 2), ['minecraft:gravel', 'minecraft:dirt']);
    create.mixing(Item.of('minecraft:coarse_dirt', 2), ['chipped:dirty_gravel', 'minecraft:dirt']);
    event.remove({ id: 'minecraft:coarse_dirt' });
	//event.shapeless(Item.of('minecraft:coarse_dirt', 4), [
	//	'3x minecraft:dirt',
	//	'1x minecraft:gravel']);

    // 2.6 混沙砂砾：沙砾 + 砂 → 合成
    event.shapeless(Item.of('chipped:sandy_gravel', 2), ['minecraft:gravel', 'minecraft:sand']);

    // 2.7 过筛砂砾：沙砾 → 筛选
    //create.splashing('chipped:sifted_gravel', 'minecraft:gravel');
    event.custom({
        type: 'bakeries:flour_sieve',
        ingredient: { item: 'minecraft:gravel' },
        output: { count: 1, id: 'chipped:sifted_gravel' }
    })

	// 忽视Chipped中的白沙，因为它不会自然生成且和BOP的白沙冲突

    // ========================================================================
    // 四、Chipped灵魂沙体系（4 种）— 通过灵魂沙 + 不同添加剂生产
    // ========================================================================

    // 3.2 精粉魂沙：魂沙 → 石磨
    create.milling('chipped:fine_soul_sand', 'minecraft:soul_sand').processingTime(150);

    // 3.11 过筛魂沙：魂沙 → 筛选
    //create.splashing('chipped:sifted_soul_sand', 'minecraft:soul_sand');
    event.custom({
        type: 'bakeries:flour_sieve',
        ingredient: { item: 'minecraft:soul_sand' },
        output: { count: 1, id: 'chipped:sifted_soul_sand' }
    })
	
    // 3.4 砾混魂沙：魂沙 + 沙砾 → 搅拌
    event.shapeless(Item.of('chipped:graveled_soul_sand', 2), ['minecraft:soul_sand', 'minecraft:gravel']);

    // 3.6 硬化魂沙：魂沙 + 岩浆膏 → 加热搅拌
    create.compacting('chipped:hardened_soul_sand', 'minecraft:soul_sand')
    create.milling('minecraft:soul_sand', 'chipped:hardened_soul_sand').processingTime(150);

    // 3.6 硬化魂沙：魂沙 + 岩浆膏 → 加热搅拌
    create.compacting('chipped:trampled_soul_sand', 'chipped:hardened_soul_sand')
    create.milling('minecraft:soul_sand', 'chipped:trampled_soul_sand').processingTime(150);
	
    // 3.6 硬化魂沙：魂沙 + 岩浆膏 → 加热搅拌
    create.compacting('chipped:faded_soul_sand', 'chipped:trampled_soul_sand')
    create.milling('chipped:hardened_soul_sand', 'chipped:faded_soul_sand').processingTime(150);
	
    // 3.6 硬化魂沙：魂沙 + 岩浆膏 → 加热搅拌
    create.compacting('chipped:smoothed_soul_sand', 'chipped:faded_soul_sand')
    create.milling('chipped:trampled_soul_sand', 'chipped:smoothed_soul_sand').processingTime(150);
	
    // ========================================================================
    // 五、IE * BOP
    // ========================================================================

    // 5.2 IE Crusher：BOP 砂岩 → 对应色砂（仿 IE 原版砂岩→砂）
    var BOP_SANDSTONES = [
        ['c:sandstone/black_blocks',   'biomesoplenty:black_sand'],
        ['c:sandstone/orange_blocks',  'biomesoplenty:orange_sand'],
        ['c:sandstone/white_blocks',   'biomesoplenty:white_sand'],
		['c:sandstone/soul_blocks',    'minecraft:soul_sand']
    ];
    BOP_SANDSTONES.forEach(function(pair) {
        event.custom({
            type: 'immersiveengineering:crusher',
            energy: 3200,
            input: { tag: pair[0] },
            result: { count: 2, id: pair[1] },
            secondaries: [{ chance: 0.5, output: { tag: 'c:dusts/saltpeter' } }]
        });
    });
	
    // 4.1 矿渣 → 粉碎轮 → 矿渣沙砾（与 IE 粉碎机互补）
    create.crushing('immersiveengineering:slag_gravel', 'immersiveengineering:slag').processingTime(200);

    // 4.2 矿渣沙砾 → 粉碎轮 → 砂（制砂）
    create.crushing('biomesoplenty:orange_sand', 'immersiveengineering:slag_gravel').processingTime(200);

    // 4.3 矿渣沙砾 → 洗涤器 → 12.5% 铝粒（水洗回收铝）
    create.splashing(CreateItem.of('immersiveengineering:nugget_aluminum', 0.125), 'immersiveengineering:slag_gravel');

    // 粗砂
	event.shapeless(Item.of('immersiveengineering:grit_sand', 5), [
		'2x chipped:coarse_sand',
		Ingredient.of('#c:sands/colorless', 3)]);

});

// ========================================================================
// 五、移除 chipped 标签中的沙/砾/魂沙变种（禁用工作台切换）
// ========================================================================
ServerEvents.tags('item', function (event) {

    var SANDSTONES = ['','cut_','chiseled_','smooth_'];
    SANDSTONES.forEach(function(s) {
		event.add('c:sandstone/white_blocks', 'biomesoplenty:' + s + 'white_sandstone');
		event.add('c:sandstone/orange_blocks', 'biomesoplenty:' + s + 'orange_sandstone');
		event.add('c:sandstone/black_blocks', 'biomesoplenty:' + s + 'black_sandstone');
		event.add('c:sandstone/soul_blocks', 'quark:' + s + 'soul_sandstone');
	});

    var SANDS = ['ash_sand','coarse_sand',
                 'kelp_sand','lush_red_sand','overgrown_sand',
                 'tar_sand',
				 'wet_sand','wet_red_sand',
				 'white_sand'];
    SANDS.forEach(function(s) { event.remove('chipped:sand', 'chipped:' + s); });
    var SANDS2 = ['pearl_sand','soft_sand','desert_sand'];
    SANDS2.forEach(function(s) {
		event.remove('chipped:sand', 'chipped:' + s);
		event.add('c:sands/colorless', 'chipped:' + s);
	});

    var GRAVELS = ['sifted_gravel',
				   'andesite_gravel','rought_gravel','orange_gravel'];
    GRAVELS.forEach(function(g) {
		event.remove('chipped:gravel', 'chipped:' + g);
		event.add('c:gravels', 'chipped:' + g);
	});
    var GRAVELS2 = ['dusty_gravel','dirty_gravel','sandy_gravel'];
    GRAVELS2.forEach(function(g) { event.remove('chipped:gravel', 'chipped:' + g); });

    var SOULS = ['fine_soul_sand','sifted_soul_sand',
				 'graveled_soul_sand',
                 'hardened_soul_sand','trampled_soul_sand','faded_soul_sand','smoothed_soul_sand'];
    SOULS.forEach(function(s) { event.remove('chipped:soul_sand', 'chipped:' + s); });
	
});

