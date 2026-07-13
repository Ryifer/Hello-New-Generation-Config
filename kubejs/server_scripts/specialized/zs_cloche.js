// ============================================================================
// zs_cloche.js — IE 园艺玻璃罩配方（BOP / F&C / Kaleidoscope Cookery）
// ----------------------------------------------------------------------------
// 原作者: Ryifer 许可证: CC BY-NC 4.0
// 此文件为传统合成方式的有益补充，不删除任何现有配方。
//
// IE 园艺玻璃罩约定（参考 IE 原版配方）：
//   1. 生长时间(tick):
//      480 → 小型花、蘑菇、单块装饰品
//      560 → 堆叠植物(仙人掌/甘蔗)、浆果、下界菌
//      640 → 基础谷物(小麦)
//      800 → 根茎作物、下界疣、藤果(西瓜/南瓜)
//     1200 → 特殊大型植物(苔藓/捕虫草)
//   2. 基底(soil) ＝ 植物自然生成的方块类型
//   3. 产量: 原版可多次收获的 → count:2，单次收获 → count:1
//   4. 流体(fluid) → 仅下界植物用 lava，其余不指定(默认流体为水)
//      流体消耗速率为固定 250mB/6000ticks，与配方 time 无关
// ============================================================================

ServerEvents.recipes(function (event) {

    function normalizeSoil(soil) {
        if (Array.isArray(soil)) {
            return soil.map(function(s) { return s.indexOf('#') === 0 ? { tag: s.substring(1) } : { item: s }; });
        }
        return soil.indexOf('#') === 0 ? { tag: soil.substring(1) } : { item: soil };
    }

    function addFluid(recipe, fluid) {
        if (fluid) recipe.fluid = { fluid: fluid };
    }

    function cloche(input, soil, results, render, time, fluid) {
        var soilObj = normalizeSoil(soil);
        var recipe = {
            type: 'immersiveengineering:cloche',
            input: { item: input },
            soil: soilObj,
            results: [],
            render: { type: 'immersiveengineering:generic', block: render },
            time: time || 480
        };
        addFluid(recipe, fluid);
        if (!Array.isArray(results)) results = [results];
        results.forEach(function(r) {
            if (typeof r === 'string') {
                recipe.results.push({ id: r });
            } else {
                recipe.results.push(r);
            }
        });
        event.custom(recipe);
    }

    function clocheCrop(input, soil, results, render, time, fluid) {
        var recipe = {
            type: 'immersiveengineering:cloche',
            input: { item: input },
            soil: normalizeSoil(soil),
            results: [],
            render: { type: 'immersiveengineering:crop', block: render },
            time: time || 640
        };
        addFluid(recipe, fluid);
        if (!Array.isArray(results)) results = [results];
        results.forEach(function(r) {
            if (typeof r === 'string') {
                recipe.results.push({ id: r });
            } else {
                recipe.results.push(r);
            }
        });
        event.custom(recipe);
    }

    function clocheDouble(input, soil, results, render, time, doublingAge, fluid) {
        var recipe = {
            type: 'immersiveengineering:cloche',
            input: { item: input },
            soil: normalizeSoil(soil),
            results: [],
            render: { type: 'immersiveengineering:doublecrop', block: render, doublingAge: doublingAge || 3 },
            time: time || 800
        };
        addFluid(recipe, fluid);
        if (!Array.isArray(results)) results = [results];
        results.forEach(function(r) {
            if (typeof r === 'string') {
                recipe.results.push({ id: r });
            } else {
                recipe.results.push(r);
            }
        });
        event.custom(recipe);
    }

    function clocheStacking(input, soil, results, render, time, fluid) {
        var soilObj = normalizeSoil(soil);
        var recipe = {
            type: 'immersiveengineering:cloche',
            input: { item: input },
            soil: soilObj,
            results: [],
            render: { type: 'immersiveengineering:stacking', block: render },
            time: time || 560
        };
        addFluid(recipe, fluid);
        results.forEach(function(r) {
            if (typeof r === 'string') {
                recipe.results.push({ id: r });
            } else {
                recipe.results.push(r);
            }
        });
        event.custom(recipe);
    }

    // ========================================================================
    // 一、Minecraft
    // ========================================================================
	
    // 蘑菇（快：菌床 mycelium/podzol；慢：普通土/沙）
    cloche('minecraft:red_mushroom', ['minecraft:dirt', '#c:sands'],
        'minecraft:red_mushroom', 'minecraft:red_mushroom', 640);
    cloche('minecraft:brown_mushroom', ['minecraft:dirt', '#c:sands'],
        'minecraft:brown_mushroom', 'minecraft:brown_mushroom', 640);
		
    // 下界植物（需岩浆）
    cloche('minecraft:red_mushroom', 'minecraft:crimson_nylium',
        'minecraft:crimson_fungus', 'minecraft:crimson_fungus', 480, 'minecraft:lava');
    cloche('minecraft:brown_mushroom', 'minecraft:warped_nylium',
        'minecraft:warped_fungus', 'minecraft:warped_fungus', 480, 'minecraft:lava');
		
    cloche('minecraft:crimson_roots', 'minecraft:crimson_nylium',
        'minecraft:crimson_roots', 'minecraft:crimson_roots', 480, 'minecraft:lava');
    cloche('minecraft:warped_roots', 'minecraft:warped_nylium',
        'minecraft:warped_roots', 'minecraft:warped_roots', 480, 'minecraft:lava');
		
    // ========================================================================
    // 二、Biomes O' Plenty
    // ========================================================================

    // 小花卉（11种）
    var BOP_FLOWERS = [
        'rose', 'lavender', 'white_lavender',
		'violet', 'wildflower',
        'goldenrod', 'icy_iris', 'glowflower',
        'orange_cosmos', 'pink_daffodil', 'pink_hibiscus', 'wilted_lily'
    ];
    BOP_FLOWERS.forEach(function(flower) {
        cloche('biomesoplenty:' + flower, 'minecraft:dirt',
            'biomesoplenty:' + flower, 'biomesoplenty:' + flower, 480);
    });

    // 高花卉（3种）
    var BOP_TALL_FLOWERS = [
        'tall_lavender', 'blue_hydrangea',
        'tall_white_lavender'
    ];
    BOP_TALL_FLOWERS.forEach(function(flower) {
        cloche('biomesoplenty:' + flower, 'minecraft:dirt',
            'biomesoplenty:' + flower, 'biomesoplenty:' + flower, 480);
    });

    // 草类
    cloche('biomesoplenty:high_grass', 'minecraft:dirt',
        'biomesoplenty:high_grass', 'biomesoplenty:high_grass', 480);
		
    cloche('minecraft:tall_grass', '#c:sands', // tall_grass -> dune_grass
        'biomesoplenty:dune_grass', 'biomesoplenty:dune_grass', 560);
    cloche('biomesoplenty:dune_grass', '#c:sands',
        'biomesoplenty:dune_grass', 'biomesoplenty:dune_grass', 560);
		
    cloche('minecraft:short_grass', '#c:sands', // short_grass -> desert_grass
        'biomesoplenty:desert_grass', 'biomesoplenty:desert_grass', 560);
    cloche('biomesoplenty:desert_grass', '#c:sands',
        'biomesoplenty:desert_grass', 'biomesoplenty:desert_grass', 560);
		
    cloche('biomesoplenty:bush', 'minecraft:coarse_dirt', // bush -> tundra_shrub
        'biomesoplenty:tundra_shrub', 'biomesoplenty:tundra_shrub', 480);
    cloche('biomesoplenty:tundra_shrub', 'minecraft:coarse_dirt',
        'biomesoplenty:tundra_shrub', 'biomesoplenty:tundra_shrub', 480);
		
    cloche('biomesoplenty:barley', 'minecraft:dirt',
        'biomesoplenty:barley', 'biomesoplenty:barley', 640);
    cloche('biomesoplenty:sea_oats', '#c:sands',
        'biomesoplenty:sea_oats', 'biomesoplenty:sea_oats', 640);

    // 水生
    cloche('biomesoplenty:watergrass', 'minecraft:clay',
        'biomesoplenty:watergrass', 'biomesoplenty:watergrass', 480);
    cloche('biomesoplenty:cattail', 'minecraft:clay',
        'biomesoplenty:cattail', 'biomesoplenty:cattail', 560);
    cloche('biomesoplenty:reed', 'minecraft:clay',
        'biomesoplenty:reed', 'biomesoplenty:reed', 560);

    // 灌木
    cloche('biomesoplenty:bush', 'minecraft:dirt',
        'biomesoplenty:bush', 'biomesoplenty:bush', 800);

    // 地被
    cloche('biomesoplenty:sprout', 'minecraft:dirt',
        [{ id: 'biomesoplenty:sprout' }], 'biomesoplenty:sprout', 360);
    cloche('biomesoplenty:clover', 'minecraft:dirt',
        [{ id: 'biomesoplenty:clover' }], 'biomesoplenty:clover', 360);
    cloche('biomesoplenty:white_petals', 'minecraft:dirt',
        [{ id: 'biomesoplenty:white_petals' }], 'biomesoplenty:white_petals', 480);

    // 仙人掌
    cloche('biomesoplenty:tiny_cactus', '#c:sands',
        'biomesoplenty:tiny_cactus', 'biomesoplenty:tiny_cactus', 560);

    // 蘑菇（快：菌床 mycelium/podzol；慢：普通土/沙）
    cloche('biomesoplenty:toadstool', ['minecraft:mycelium', 'minecraft:podzol'],
        'biomesoplenty:toadstool', 'biomesoplenty:toadstool', 480);
    cloche('biomesoplenty:toadstool', ['minecraft:dirt', '#c:sands'],
        'biomesoplenty:toadstool', 'biomesoplenty:toadstool', 640);
    cloche('biomesoplenty:glowshroom', ['minecraft:mycelium', 'minecraft:podzol'],
        'biomesoplenty:glowshroom', 'biomesoplenty:glowshroom', 480);
    cloche('biomesoplenty:glowshroom', ['minecraft:dirt', '#c:sands'],
        'biomesoplenty:glowshroom', 'biomesoplenty:glowshroom', 640);

    // 下界植物（需岩浆）
    cloche('biomesoplenty:burning_blossom', 'minecraft:netherrack',
        'biomesoplenty:burning_blossom', 'biomesoplenty:burning_blossom', 480, 'minecraft:lava');
    //cloche('biomesoplenty:bramble', 'minecraft:netherrack', // 藤蔓
    //    'biomesoplenty:bramble', 'biomesoplenty:bramble', 800, 'minecraft:lava');

    // 末地植物
    cloche('biomesoplenty:endbloom', 'minecraft:end_stone',
        'biomesoplenty:endbloom', 'biomesoplenty:endbloom', 480);
    cloche('biomesoplenty:enderphyte', 'minecraft:end_stone',
        'biomesoplenty:enderphyte', 'biomesoplenty:enderphyte', 480);
    //cloche('biomesoplenty:lumaloop', 'minecraft:end_stone', // 藤蔓
    //    'biomesoplenty:lumaloop', 'biomesoplenty:lumaloop', 480);
		
    // ========================================================================
    // 三、Farm & Charm
    // ========================================================================

    // 大麦（1格）
    clocheCrop('farm_and_charm:barley_seeds', 'minecraft:dirt', [
        { id: 'farm_and_charm:barley', count: 2 },
        { chance: 0.25, output: { id: 'farm_and_charm:barley_seeds' } }
    ], 'farm_and_charm:barley_crop', 560);

    // 燕麦（1格）
    clocheCrop('farm_and_charm:oat_seeds', 'minecraft:dirt', [
        { id: 'farm_and_charm:oat', count: 2 },
        { chance: 0.25, output: { id: 'farm_and_charm:oat_seeds' } }
    ], 'farm_and_charm:oat_crop', 560);

    // 生菜（1格）
    clocheCrop('farm_and_charm:lettuce_seeds', 'minecraft:dirt', [
        { id: 'farm_and_charm:lettuce', count: 2 },
        { chance: 0.25, output: { id: 'farm_and_charm:lettuce_seeds' } }
    ], 'farm_and_charm:lettuce_crop', 560);

    // 番茄（1格）
    clocheCrop('farm_and_charm:tomato_seeds', 'minecraft:dirt', [
        { id: 'farm_and_charm:tomato', count: 2 },
        { chance: 0.25, output: { id: 'farm_and_charm:tomato_seeds' } }
    ], 'farm_and_charm:tomato_crop', 560);

    // 草莓（1格）
    clocheCrop('farm_and_charm:strawberry_seeds', 'minecraft:dirt', [
        { id: 'farm_and_charm:strawberry', count: 2 },
        { chance: 0.25, output: { id: 'farm_and_charm:strawberry_seeds' } }
    ], 'farm_and_charm:strawberry_crop', 560);

    // 玉米（2格，仿麻 doublecrop）
    clocheDouble('farm_and_charm:kernels', 'minecraft:dirt', 
        { id: 'farm_and_charm:corn', count: 2 }, 'farm_and_charm:corn_crop', 560, 3);

    // 洋葱（1格） 无种子
    clocheCrop('farm_and_charm:onion', 'minecraft:dirt',
        { id: 'farm_and_charm:onion', count: 2 }, 'farm_and_charm:onion_crop', 560);

    // 荨麻（野生→自复制） 无种子
    cloche('farm_and_charm:wild_nettle', 'minecraft:dirt',
        [{ id: 'farm_and_charm:wild_nettle', count: 2 }], 'farm_and_charm:wild_nettle', 480);

    // 车前草（野生→自复制） 无种子
    cloche('farm_and_charm:wild_ribwort', 'minecraft:dirt',
        { id: 'farm_and_charm:wild_ribwort', count: 2 }, 'farm_and_charm:wild_ribwort', 480);
	
    // ========================================================================
    // 四、Kaleidoscope Cookery Series
    // ========================================================================

    // 水稻（双基底：旱地 dirt 低产，水田 clay 高产）
    clocheDouble('kaleidoscope_cookery:wild_rice', 'minecraft:dirt',
        { id: 'kaleidoscope_cookery:rice_panicle', count: 2 }, 'farmersdelight:rice', 640, 3);
    clocheDouble('kaleidoscope_cookery:wild_rice', 'minecraft:clay',
        { id: 'kaleidoscope_cookery:rice_panicle', count: 2 }, 'farmersdelight:rice', 480, 3);

    // 辣椒（1格）
    clocheCrop('kaleidoscope_cookery:chili_seed', 'minecraft:dirt', [
        { id: 'kaleidoscope_cookery:red_chili' },
        { chance: 0.25, output: { id: 'kaleidoscope_cookery:green_chili' } }
    ], 'kaleidoscope_cookery:chili_crop', 560);

    // 生菜（1格）
    clocheCrop('kaleidoscope_cookery:lettuce_seed', 'minecraft:dirt', [
        { id: 'kaleidoscope_cookery:lettuce', count: 2 },
        { chance: 0.25, output: { id: 'kaleidoscope_cookery:lettuce_seed' } }
    ], 'kaleidoscope_cookery:lettuce_crop', 560);

    // 番茄（1格）
    clocheCrop('kaleidoscope_cookery:tomato_seed', 'minecraft:dirt', [
        { id: 'kaleidoscope_cookery:tomato', count: 2 },
        { chance: 0.25, output: { id: 'kaleidoscope_cookery:tomato_seed' } }
    ], 'kaleidoscope_cookery:tomato_crop', 560);

    // ========================================================================
    // 五、Supplementaries
    // ========================================================================

    // 亚麻（2格，仿大麻 doublecrop）
    clocheDouble('supplementaries:flax_seeds', 'minecraft:dirt', [
        { id: 'supplementaries:flax', count: 2 },
        { chance: 0.25, output: { id: 'supplementaries:flax_seeds' } }
    ], 'supplementaries:flax', 600, 3);

    // ========================================================================
    // 六、Kaleidoscope Tavern + Dim Wine
    // ========================================================================

    // 啤酒花（1格）
    clocheCrop('kaleidoscope_dim_wine:hop_seed', 'minecraft:dirt',
        [{ id: 'kaleidoscope_dim_wine:hop', count: 2 }],
        'kaleidoscope_dim_wine:hop_crop', 640);

    // Tavern 葡萄（基底决定变种：岩浆块/下界岩→金葡萄，冰/浮冰/蓝冰→冰葡萄，其余→紫葡萄）
    // 普通葡萄（dirt 基底，30% 青葡萄副产）
    clocheCrop('kaleidoscope_tavern:grapevine', 'minecraft:dirt', [
        { id: 'kaleidoscope_tavern:grape' },
        { chance: 0.7, output: { id: 'kaleidoscope_tavern:grape' } },
        { chance: 0.3, output: { id: 'kaleidoscope_tavern:green_grape' } }
    ], 'kaleidoscope_tavern:grape_crop', 640);

    // 金葡萄（下界岩/岩浆块基底，30% 青葡萄副产）
    clocheCrop('kaleidoscope_tavern:grapevine', ['minecraft:netherrack', 'minecraft:magma_block'], [
        { id: 'kaleidoscope_tavern:gold_grape' },
        { chance: 0.7, output: { id: 'kaleidoscope_tavern:gold_grape' } },
        { chance: 0.3, output: { id: 'kaleidoscope_tavern:green_grape' } }
    ], 'kaleidoscope_tavern:gold_grape_crop', 640);

    // 冰葡萄（冰/浮冰/蓝冰基底，30% 青葡萄副产）
    clocheCrop('kaleidoscope_tavern:grapevine', ['minecraft:ice', 'minecraft:packed_ice', 'minecraft:blue_ice'], [
        { id: 'kaleidoscope_tavern:ice_grape' },
        { chance: 0.7, output: { id: 'kaleidoscope_tavern:ice_grape' } },
        { chance: 0.3, output: { id: 'kaleidoscope_tavern:green_grape' } }
    ], 'kaleidoscope_tavern:ice_grape_crop', 640);
	
    // 绯红葡萄（下界，需岩浆）
    clocheCrop('kaleidoscope_dim_wine:crimson_grapevine', 'minecraft:crimson_nylium',
        [{ id: 'kaleidoscope_dim_wine:crimson_grape', count: 2 }],
        'kaleidoscope_dim_wine:crimson_grape_crop', 640, 'minecraft:lava');

    // 诡异葡萄（下界，需岩浆）
    clocheCrop('kaleidoscope_dim_wine:warped_grapevine', 'minecraft:warped_nylium',
        [{ id: 'kaleidoscope_dim_wine:warped_grape', count: 2 }],
        'kaleidoscope_dim_wine:warped_grape_crop', 640, 'minecraft:lava');

    // ========================================================================
    // 七、其他
    // ========================================================================

    // 水稻（补充农夫乐事水田 clay 高产）
    clocheDouble('farmersdelight:rice', 'minecraft:clay',
        { id: 'farmersdelight:rice_panicle', count: 2 }, 'farmersdelight:rice', 480, 3);

});
