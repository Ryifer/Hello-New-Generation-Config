// ============================================================================
// zs_ie_compat.js — IE × Create 酸体系与铜氧化还原
// ----------------------------------------------------------------------------
// 原作者: Ryifer 许可证: CC BY-NC 4.0
// 不修改任何原 kubejs 脚本，方便保持对上游的跟进。
// ============================================================================

ServerEvents.recipes(function (event) {

    var create = event.recipes.create;

    // ========================================================================
    // 一、整理CDG酸和IE红石酸的关系，形成循环体系
	// 基于电池合成表认为，CDG酸是浓硫酸，IE红石酸是稀硫酸，二者可互相转化。
    // ========================================================================

    // 1.1 移除 IE 默认红石酸老化铜配方（改为新体系）
    event.remove({ id: 'immersiveengineering:bottling/copper_aging' });
    event.remove({ id: 'immersiveengineering:bottling/copper_aging2' });
    event.remove({ id: 'immersiveengineering:bottling/copper_aging3' });

    // 1.2 酸循环：稀硫酸(+)原料 → 浓硫酸(催化碳化) → 稀硫酸(再生)
    // 1.2.1 稀释：浓硫酸 → 稀硫酸（慢速安全注水）
    create.mixing(Fluid.of('immersiveengineering:redstone_acid', 250), [
        Fluid.of('powergrid:acid', 125),
        Fluid.of('minecraft:water', 125),
        'minecraft:redstone'
    ]);
    // 1.2.2 提浓：稀硫酸 → 浓硫酸（加硫浓缩）
    create.mixing(Fluid.of('powergrid:acid', 250), [
        Fluid.of('immersiveengineering:redstone_acid', 200),
        'minecraft:blaze_powder'
    ]).heated();
    // 1.2.3 IE Refinery：浓硫酸 + 水 → 稀硫酸（安全稀释）
    event.custom({
        type: 'immersiveengineering:refinery',
        energy: 80,
        input0: { amount: 125, tag: 'powergrid:acid' },
        input1: { amount: 125, tag: 'minecraft:water' },
        result: { amount: 250, id: 'immersiveengineering:redstone_acid' }
    });
    // 1.2.4 IE Mixer：稀硫酸 + 烈焰粉 → 浓硫酸（加硫浓缩）
    event.custom({
        type: 'immersiveengineering:mixer',
        energy: 800,
        fluid: { amount: 250, tag: 'c:redstone_acid' },
        inputs: [{ item: 'minecraft:blaze_powder' }],
        result: { amount: 200, id: 'powergrid:acid' }
    });

    // 1.3. 浓硫酸碳化（酸催化循环：原料→炭，酸可间接再生）
    // 1.3.1 糖 → 炭
    create.mixing([
        Item.of('minecraft:charcoal'),
        Fluid.of('immersiveengineering:redstone_acid', 250)
    ], [
        'minecraft:sugar',
        Fluid.of('powergrid:acid', 250)
    ]);
    // 1.3.2 原木 → 炭（Ingredient.of 包装使 JEI 可正确解析矿辞）
    create.mixing([
        Item.of('minecraft:charcoal'),
        Fluid.of('immersiveengineering:redstone_acid', 250)
    ], [
        Ingredient.of('#minecraft:logs'),
        Fluid.of('powergrid:acid', 250)
    ]);

    // 1.4. 铜氧化还原（逐步反应）
    //     除锈：redstone_acid → 逐级去掉氧化层
    //     生锈：CPG acid    → 逐级加速氧化
    var COPPER_LEVELS = [
        ['minecraft:copper_block',       'minecraft:exposed_copper'],
        ['minecraft:exposed_copper',     'minecraft:weathered_copper'],
        ['minecraft:weathered_copper',   'minecraft:oxidized_copper']
    ];
    // 1.4.1 CPG 浓硫酸 → 生锈（正向老化）
    COPPER_LEVELS.forEach(function(pair) {
        create.filling(pair[1], [
            Ingredient.of(pair[0]),
            Fluid.of('powergrid:acid', 125)
        ]);
        event.custom({
            type: 'immersiveengineering:bottling_machine',
            input: { item: pair[0] },
            fluid: { amount: 125, tag: 'powergrid:acid' },
            results: [{ id: pair[1] }]
        });
    });
    // 1.4.2 IE 红石酸 → 除锈（逆向清洗）
    var CLEAN_LEVELS = [
        ['minecraft:oxidized_copper',   'minecraft:weathered_copper'],
        ['minecraft:weathered_copper',  'minecraft:exposed_copper'],
        ['minecraft:exposed_copper',    'minecraft:copper_block']
    ];

    CLEAN_LEVELS.forEach(function(pair) {
        create.filling(pair[1], [
            Ingredient.of(pair[0]),
            Fluid.of('immersiveengineering:redstone_acid', 125)
        ]);
        event.custom({
            type: 'immersiveengineering:bottling_machine',
            input: { item: pair[0] },
            fluid: { amount: 125, tag: 'c:redstone_acid' },
            results: [{ id: pair[1] }]
        });
    });

    // ========================================================================
    // 二、CDG 发酵罐作物→乙醇（从 IE 发酵机移植，需加热平衡）
    // ========================================================================

    var CROP_ETHANOL = [
        ['minecraft:apple',            80],
        ['minecraft:beetroot',         40],
        ['minecraft:glow_berries',    100],
        ['minecraft:melon_slice',      20],
        ['minecraft:potato',           80],
        ['minecraft:sugar_cane',       80],
        ['minecraft:sweet_berries',    50],
        ['minecraft:honey_bottle',    250]
    ];
    CROP_ETHANOL.forEach(function(pair) {
        event.custom({
            type: 'createdieselgenerators:basin_fermenting',
            ingredients: [{ item: pair[0] }],
            processing_time: 400,
            heat_requirement: 'heated',
            results: [{ id: 'createdieselgenerators:ethanol', amount: pair[1] }]
        });
        event.custom({
            type: 'createdieselgenerators:bulk_fermenting',
            ingredients: [{ item: pair[0] }],
            processing_time: 200,
            heat_requirement: 'heated',
            results: [{ id: 'createdieselgenerators:ethanol', amount: pair[1] }]
        });
    });

    // ========================================================================
    // 三、CDG 燃料精炼（IE 生物燃料 → CDG 标准燃料）
    // ========================================================================

    // 3.1 IE 乙醇 → CDG 乙醇
    event.custom({
        type: 'createdieselgenerators:basin_fermenting',
        ingredients: [
            { type: 'fluid_stack', fluid: 'immersiveengineering:ethanol', amount: 1 }
        ],
        processing_time: 1,
        results: [
            { id: 'createdieselgenerators:ethanol', amount: 1 }
        ]
    });
    event.custom({
        type: 'createdieselgenerators:bulk_fermenting',
        ingredients: [
            { type: 'fluid_stack', fluid: 'immersiveengineering:ethanol', amount: 1 }
        ],
        processing_time: 1,
        results: [
            { id: 'createdieselgenerators:ethanol', amount: 1 }
        ]
    });
    create.mixing('createdieselgenerators:ethanol',
        Fluid.of('immersiveengineering:ethanol', 250));

    // 3.2 IE 生物柴油 → CDG 生物柴油
    event.custom({
        type: 'createdieselgenerators:basin_fermenting',
        ingredients: [
            { type: 'fluid_stack', fluid: 'immersiveengineering:biodiesel', amount: 1 }
        ],
        processing_time: 1,
        results: [
            { id: 'createdieselgenerators:biodiesel', amount: 1 }
        ]
    });
    event.custom({
        type: 'createdieselgenerators:bulk_fermenting',
        ingredients: [
            { type: 'fluid_stack', fluid: 'immersiveengineering:biodiesel', amount: 1 }
        ],
        processing_time: 1,
        results: [
            { id: 'createdieselgenerators:biodiesel', amount: 1 }
        ]
    });
    create.mixing('createdieselgenerators:biodiesel',
        Fluid.of('immersiveengineering:biodiesel', 250));
	
    // ========================================================================
    // 四、锯末
    // ========================================================================

    event.remove({ id: 'immersiveengineering:crafting/sawdust' });
    create.compacting('immersiveengineering:sawdust', [
        Ingredient.of('#c:dusts/wood', 1)
    ]);
    create.compacting('createdieselgenerators:chip_wood_block', [
        '4x immersiveengineering:sawdust'
    ]);
    create.compacting('immersiveengineering:fiberboard', [
        Ingredient.of('#c:dusts/wood', 8),
        Fluid.of('immersiveengineering:creosote', 250)
    ]);
    create.compacting('immersiveengineering:fiberboard', [
        Item.of('createdieselgenerators:chip_wood_block', 2),
        Fluid.of('immersiveengineering:creosote', 250)
    ]);
    create.crushing([
        Item.of('createdieselgenerators:wood_chip', 1)
    ], 'immersiveengineering:sawdust').processingTime(200);
    create.crushing([
        Item.of('createdieselgenerators:wood_chip', 8)
    ], 'immersiveengineering:fiberboard').processingTime(200);
	
});
