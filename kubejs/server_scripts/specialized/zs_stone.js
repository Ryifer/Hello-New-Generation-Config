// ============================================================================
// zs_stone.js — 石头配方补充
// ----------------------------------------------------------------------------
// 原作者: Ryifer 许可证: CC BY-NC 4.0
// 此文件为本地补充，不修改任何原 kubejs 脚本，方便保持对上游的跟进。
// ============================================================================

ServerEvents.recipes(function (event) {

    var create = event.recipes.create;

    // ========================================================================
    // 一、原版粉碎路线调整（粉碎轮->沙子/石磨->沙砾）
    // ========================================================================
    
	// 1.1 一步粉碎：圆石粉碎为沙子 危险设计-暂时禁用
    //create.crushing([
    //    Item.of('minecraft:sand'),
    //    CreateItem.of('minecraft:flint', 0.10),
    //    CreateItem.of('minecraft:clay_ball', 0.05)
    //], 'minecraft:cobblestone').processingTime(200);

    // 1.2 限制石磨粉碎杂石为沙砾（一步粉碎在BOP）
    event.remove({ id: 'create:milling/andesite' });
    //create.milling('minecraft:gravel', 'minecraft:andesite').processingTime(250);
    event.remove({ id: 'create:crushing/diorite' });
    event.remove({ id: 'create:crushing/diorite_recycling' });
    event.remove({ id: 'create:milling/granite' });
    create.crushing([
        Item.of('minecraft:red_sand')
    ], 'minecraft:granite').processingTime(200);

    // 5.1.2 安山岩 → 粉碎
    create.crushing([
        Item.of('minecraft:sand', 1),
        CreateItem.of('minecraft:quartz', 0.125)
    ], 'minecraft:andesite').processingTime(200);
    // 5.3.2 闪长岩 → 粉碎
    create.crushing([
        Item.of('minecraft:sand', 1),
        CreateItem.of('minecraft:quartz', 0.25)
    ], 'minecraft:diorite').processingTime(200);
	
    // ========================================================================
    // 二、石灰岩循环（沉积岩成岩/风化）
	// create/dndecor + quark
    // ========================================================================

    // 2.1.1 合成石灰岩：碳酸盐砂 + 有机胶结物 + 泥质基质 → 压实成岩
    create.compacting('create:limestone', [
        'minecraft:gravel',
        '2x minecraft:bone_meal',
        'minecraft:clay_ball'
    ]);
    // 2.1.2 合成石灰岩：方解石 + 泥质基质 → 变质成岩
    create.compacting('create:limestone', [
        'minecraft:calcite',
        'minecraft:clay_ball'
    ]);

    // 2.2 粉碎石灰岩：分离碳酸盐成分和泥质不溶残渣
    event.remove({ id: 'create_ultimate_factory:crushing_limestone' });
    create.crushing([
        CreateItem.of('minecraft:bone_meal', 0.5),
        CreateItem.of('minecraft:clay_ball', 0.25)
    ], 'create:limestone').processingTime(250);

    // ========================================================================
    // 三、大理石变质路线（石灰岩 → 大理岩 → 变质矿物）
	// clutter + yusshya
    // ========================================================================

    // 3.1 移除 Cluttered 的方解石+石英有序合成（与地质成因不符）
    event.remove({ id: 'cluttered:raw_marble' });

    // 3.2.1 石灰岩 + 岩浆 → 加热 → 大理石 + 方铅矿（对应 MVT 型矿床的低温热液条件）
    create.mixing([
        Item.of('cluttered:raw_marble'),
        CreateItem.of('immersiveengineering:raw_lead', 0.15),
        CreateItem.of('immersiveengineering:nugget_silver', 0.15)
    ], [Ingredient.of('#c:stone/limestones'), Fluid.of('minecraft:lava', 250)]).heated();
    // 3.2.2 石灰岩 + 岩浆 → 超高温变质 → 大理石 + 8% 青金石
    create.mixing([
        Item.of('cluttered:raw_marble'),
        CreateItem.of('minecraft:lapis_lazuli', 0.08)
    ], [Ingredient.of('#c:stone/limestones'), Fluid.of('minecraft:lava', 50)]).superheated();

    // 3.3 大理石 → 粉碎 → 方解石 + 50% 石英（变质岩风化分离）
    create.crushing([
        CreateItem.of('minecraft:calcite', 0.75),
        CreateItem.of('minecraft:quartz', 0.5)
    ], 'cluttered:raw_marble').processingTime(250);

    // ========================================================================
    // 四、岩浆硫化物镍铁路线（超基性岩浆 + 硫 → 镍黄铁矿）
    // ========================================================================

    // 4.1 硫磺石 + 岩浆 → 超高温 → 玄武岩 + 铁矿 + 镍矿（模拟岩浆硫化物熔离）
    create.mixing([
        Item.of('minecraft:basalt'),
        CreateItem.of('minecraft:raw_iron', 0.10),
        CreateItem.of('immersiveengineering:raw_nickel', 0.05),
    ], ['biomesoplenty:brimstone', Fluid.of('minecraft:lava', 250)]).superheated();

    // ========================================================================
    // 五、Scoria / Scorchia 路线重构（灵魂沙热液 + 黑沙色素）
    // ========================================================================

    // 5.1 移除原版熔炉烧灵魂沙→scoria（地狱里高温本就不缺热）
    event.remove({ id: 'create:smelting/scoria' });

    // 5.2 灵魂沙 + 岩浆 → 加热搅拌 → 2 scoria（模拟地狱热泉烧结）
    create.mixing(Item.of('create:scoria', 2),
        ['minecraft:soul_sand', Fluid.of('minecraft:lava', 50)]).heated();

    // 5.3 灵魂沙 + 黑沙 + 岩浆 → 加热搅拌 → 3 scorchia（黑沙提供黑色素）
    create.mixing(Item.of('create:scorchia', 3),
        ['minecraft:soul_sand', 'biomesoplenty:black_sand', Fluid.of('minecraft:lava', 50)]).heated();

    // 5.4 优化粉碎逻辑
    event.remove({ id: 'create_ultimate_factory:crushing_scoria' });
    create.crushing([
        CreateItem.of('minecraft:soul_sand', 0.5),
        CreateItem.of('minecraft:blaze_powder', 0.125)
    ], 'create:scoria').processingTime(250);
    create.crushing([
        CreateItem.of('minecraft:soul_sand', 0.35),
        CreateItem.of('minecraft:black_dye', 0.05)
    ], 'create:scorchia').processingTime(250);
	
});

// ========================================================================
// 五、统一石灰岩
// ========================================================================
ServerEvents.tags('item', function (event) {

    event.add('c:stone/limestones', 'create:limestone');
    //event.add('c:stone/limestones', 'dndecor:weathered_limestone');
    event.add('c:stone/limestones', 'quark:limestone');
	
    event.add('c:stone/marble', 'cluttered:raw_marble');
    //event.add('c:stone/marble', 'yuushya:marble');

});