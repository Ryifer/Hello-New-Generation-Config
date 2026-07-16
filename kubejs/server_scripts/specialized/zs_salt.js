// ============================================================================
// zs_salt.js — 盐体系补充（岩盐粉碎 / 海水蒸发 / 海盐标签）
// ----------------------------------------------------------------------------
// 原作者: Ryifer 许可证: CC BY-NC 4.0
// 延续盐统一路线：kc_chinesefood:salt 为统一标的物。
// ============================================================================

ServerEvents.recipes(function (event) {

    var create = event.recipes.create;

    // ========================================================================
    // 一、岩盐路线：BOP 干盐 → 粉碎提纯
    // ========================================================================

    // 1.1 岩盐（含杂质）→ 粉碎 → 粗盐 + 粘土
    create.crushing([
        Item.of('kaleidoscope_chinesefood:salt', 3),
        CreateItem.of('kaleidoscope_chinesefood:salt', 0.25),
        Item.of('minecraft:clay_ball', 1)
    ], 'biomesoplenty:dried_salt').processingTime(200);

    // 1.2 盐矿→ 粉碎 → 粗盐 + 圆石
    create.crushing([
        Item.of('kaleidoscope_chinesefood:salt', 2),
        CreateItem.of('kaleidoscope_chinesefood:salt', 0.25),
        CreateItem.of('minecraft:cobblestone', 0.125)
    ], 'bakeries:salt_ore').processingTime(200);
    create.crushing([
        Item.of('kaleidoscope_chinesefood:salt', 2),
        CreateItem.of('kaleidoscope_chinesefood:salt', 0.25),
        CreateItem.of('minecraft:cobbled_deepslate', 0.125)
    ], 'bakeries:deepslate_salt_ore').processingTime(200);
	
    // ========================================================================
    // 二、海盐路线：Create 加热蒸发
    // ========================================================================

    // 2.1 水 → 加热搅拌 → 盐水
    create.mixing(Fluid.of('bakeries:salt_water', 125), Fluid.of('minecraft:water', 250)).superheated();
	
    // 2.2 盐水 → 加热搅拌 → 盐
    create.mixing('refurbished_furniture:sea_salt', Fluid.of('bakeries:salt_water', 125)).superheated();

    // ========================================================================
    // 三、盐溶于水（反向合成，完整性）
    // ========================================================================

    // 3.1 4 盐 + 水桶 → 盐水桶
    event.shapeless('bakeries:salt_water_bucket', [
        Ingredient.of('#c:salt', 4),
        'minecraft:water_bucket'
    ]);
	
    // 3.2 盐 + 水 → 盐水
    create.mixing(Fluid.of('bakeries:salt_water', 250), [
		Fluid.of('minecraft:water', 250),
		Ingredient.of('#c:salt')]);

    // ========================================================================
    // 四、修改原版熔炼 → 篝火蒸发（更写实）
    // ========================================================================

    // 4.1 移除 KC 原版熔炉烧水→盐桶（不合直觉）
    event.remove({ id: 'kaleidoscope_chinesefood:smelting/salt' });

    // 4.2 篝火慢熬：水桶 → 盐桶（1200 tick，无需燃料）
    event.campfireCooking('kaleidoscope_chinesefood:salt_bucket', 'minecraft:water_bucket').cookingTime(1200);

    // ========================================================================
    // 五、压块 + 磨制分解（替代手搓拆解）
    // ========================================================================

    // 5.1 盐块：9 盐 → 压块 → 盐块
    create.compacting('bakeries:raw_salt_block', [
        Ingredient.of('#c:salt', 9)
    ]);

    // 5.2 盐块 → 磨制 → 9 盐（替代手搓拆解）
    event.remove({ id: 'bakeries:integration/create/milling/salt' });
    create.milling('9x kaleidoscope_chinesefood:salt',
        'bakeries:raw_salt_block').processingTime(200);

    // 5.3 干岩盐：4 盐 + 粘土 → 压块 → 干岩盐（人工盐壳，含泥质胶结物）
    create.compacting('biomesoplenty:dried_salt', [
        Ingredient.of('#c:salt', 4),
        'minecraft:clay_ball'
    ]);
});


// ============================================================================
// 六、海盐标签
// ============================================================================
ServerEvents.tags('item', function (event) {

    // 4.1 海盐加入 c:salt，使所有盐标签配方可接受海盐
    event.add('c:salt', 'refurbished_furniture:sea_salt');
});
