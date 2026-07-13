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
