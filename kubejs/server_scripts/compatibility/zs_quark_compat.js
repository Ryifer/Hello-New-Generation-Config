// ============================================================================
// zs_quark.js — Quark 石材 × Create 加工兼容
// ----------------------------------------------------------------------------
// 原作者: Ryifer 许可证: CC BY-NC 4.0
// 此文件为本地补充，不修改任何原 kubejs 脚本，方便保持对上游的跟进。
// ============================================================================

ServerEvents.recipes(function (event) {

    var create = event.recipes.create;

    // ========================================================================
    // 一、Limestone — 石灰岩互转
    // ========================================================================

    event.shapeless('create:limestone', ['quark:limestone']);
    event.shapeless('quark:limestone', ['create:limestone']);

    // ========================================================================
    // 二、Jasper — 碧玉（微晶石英 + 铁氧化物）
    // ========================================================================

    // 2.1 合成：红沙 + 石英 → 压块 → 碧玉
    create.compacting('quark:jasper', ['minecraft:red_sand', 'minecraft:quartz']);

    // 2.2 粉碎：碧玉 → 红沙 + 50% 石英
    create.milling([
		'chipped:orange_gravel',
        CreateItem.of('minecraft:quartz', 0.25)
	], 'quark:jasper').processingTime(150);
    create.crushing([
        Item.of('minecraft:red_sand'),
        CreateItem.of('minecraft:quartz', 0.5)
    ], 'quark:jasper').processingTime(200);

    // ========================================================================
    // 三、Shale — 页岩（泥质沉积岩）
    // ========================================================================

    // 3.1 合成：沙砾 + 3 粘土 → 压块 → 页岩
    create.compacting('quark:shale', [
        'minecraft:gravel',
        '3x minecraft:clay_ball'
    ]);

    // 3.2 粉碎：页岩 → 沙砾 + 25% 粘土
    create.milling([
		'minecraft:gravel',
        CreateItem.of('minecraft:clay_ball', 0.125)
	], 'quark:shale').processingTime(150);
    create.crushing([
        Item.of('minecraft:sand'),
        CreateItem.of('minecraft:clay_ball', 0.25)
    ], 'quark:shale').processingTime(200);

    // ========================================================================
    // 四、Permafrost — 永冻石（多年冻结土壤）
    // ========================================================================

    // 4.1 冻结：砂土 → 冷冻鼓风机 → 永冻石
    event.custom({
        type: 'create_dragons_plus:freezing',
        ingredients: [{ item: 'minecraft:coarse_dirt' }],
        results: [{ id: 'quark:permafrost' }]
    });

    // 4.2 破碎：永冻石 → 砂土（冻结状态崩解）
    create.crushing('minecraft:coarse_dirt', 'quark:permafrost').processingTime(200);

    // 4.3 融化：永冻石 → 加热搅拌 → 土 + 100mb 水
    create.mixing([
        Item.of('minecraft:coarse_dirt'),
        Fluid.of('minecraft:water', 100)
    ], 'quark:permafrost').heated();

    // ========================================================================
    // 五、Myalite — 幻境石（末地变异岩）
    // ========================================================================

    // 5.1 合成：末地石粉 + 紫珀 → 搅拌 → 幻境石
    create.mixing('quark:myalite', [
        'aeronautics:end_stone_powder',
        '3x minecraft:popped_chorus_fruit'
    ]);

    // 5.2 粉碎：幻境石 → 末地石粉 + 25% 紫珀
    create.crushing([
        Item.of('aeronautics:end_stone_powder'),
        CreateItem.of('minecraft:popped_chorus_fruit', 0.25)
    ], 'quark:myalite').processingTime(200);

    // ========================================================================
    // 六、玻璃粉碎 → 碎片
    // ========================================================================

    create.crushing(Item.of('quark:clear_shard', 2), 'minecraft:glass_bottle').processingTime(150);

    // ========================================================================
    // 七、刚玉粉碎 → 铝粉 + 染料
    // 刚玉（Al₂O₃，莫氏硬度 9）= 氧化铝结晶
    // 粉碎得 IE铝粉 + 对应染料
    // ========================================================================

    var COLORS = ['black', 'blue', 'green', 'indigo', 'orange', 'red', 'violet', 'white', 'yellow'];
    var DYE_MAP = { black:'black_dye', blue:'blue_dye', green:'green_dye', indigo:'blue_dye', orange:'orange_dye', red:'red_dye', violet:'purple_dye', white:'white_dye', yellow:'yellow_dye' };

    COLORS.forEach(function(c) {
       create.crushing([
            Item.of('immersiveengineering:dust_aluminum', 2),
            CreateItem.of('minecraft:' + DYE_MAP[c], 0.75)
       ], 'quark:' + c + '_corundum').processingTime(200);
       create.crushing([
            Item.of('immersiveengineering:dust_aluminum', 2),
            CreateItem.of('minecraft:' + DYE_MAP[c], 0.75)
        ], 'quark:waxed_' + c + '_corundum').processingTime(200);
       create.crushing([
            Item.of('immersiveengineering:dust_aluminum', 1),
            CreateItem.of('minecraft:' + DYE_MAP[c], 0.50)
       ], 'quark:' + c + '_corundum_cluster').processingTime(200);
       create.crushing([
            CreateItem.of('immersiveengineering:dust_aluminum', 0.5),
            CreateItem.of('minecraft:' + DYE_MAP[c], 0.25)
       ], 'quark:' + c + '_corundum_pane').processingTime(200);
       create.crushing([
            Item.of('immersiveengineering:dust_aluminum', 2),
            CreateItem.of('minecraft:' + DYE_MAP[c], 0.75),
            Item.of('minecraft:redstone', 1)
       ], 'quark:' + c + '_crystal_lamp').processingTime(200);
    });
});
