// ============================================================================
// zs_crystal.js — 水晶体系（生长 / 粉碎 / 破坏掉落）
// ----------------------------------------------------------------------------
// 原作者: Ryifer 许可证: CC BY-NC 4.0
// 标准化和合理化 紫水晶-玫瑰石英-刚玉
// ============================================================================

ServerEvents.recipes(function (event) {

    var create = event.recipes.create;

    // ========================================================================
    // 一、方块配方修正（体素合理性：9 物品 = 1 满方块）
    // ========================================================================

    // 1.1 BOP 玫瑰石英块：4 碎块(2×2) → 9 碎块(3×3)
    event.remove({ output: 'biomesoplenty:rose_quartz_block' });
    event.shaped('biomesoplenty:rose_quartz_block', [
        '###',
        '###',
        '###'
    ], { '#': 'biomesoplenty:rose_quartz_chunk' });

    // 1.2 原版紫水晶块：4 碎片(2×2) → 9 碎片(3×3)
    event.remove({ output: 'minecraft:amethyst_block' });
    event.shaped('minecraft:amethyst_block', [
        '###',
        '###',
        '###'
    ], { '#': 'minecraft:amethyst_shard' });

    // ========================================================================
    // 二、玫瑰石英簇四阶段：迭代合成
    //     碎块 → 小芽 → 中芽 → 大芽 → 簇
    //     小芽手动合成，中芽及以上可通过 有序合成(纵向) 或 Deployer。
    // ========================================================================

    // 2.1 小芽 → 手动（基础单位）
    event.shapeless('biomesoplenty:small_rose_quartz_bud', [
        'biomesoplenty:rose_quartz_chunk'
    ]);

    // 2.2 中芽 → 2 小芽
    event.shaped('biomesoplenty:medium_rose_quartz_bud', [
        '#',
        '#'
    ], { '#': 'biomesoplenty:small_rose_quartz_bud' });
    create.deploying('biomesoplenty:medium_rose_quartz_bud', [
        'biomesoplenty:small_rose_quartz_bud',
        'biomesoplenty:small_rose_quartz_bud'
    ]);

    // 2.3 大芽 → 2 中芽
    event.shaped('biomesoplenty:large_rose_quartz_bud', [
        '#',
        '#'
    ], { '#': 'biomesoplenty:medium_rose_quartz_bud' });
    create.deploying('biomesoplenty:large_rose_quartz_bud', [
        'biomesoplenty:medium_rose_quartz_bud',
        'biomesoplenty:medium_rose_quartz_bud'
    ]);

    // 2.4 簇 → 2 大芽
    event.shaped('biomesoplenty:rose_quartz_cluster', [
        '#',
        '#'
    ], { '#': 'biomesoplenty:large_rose_quartz_bud' });
    create.deploying('biomesoplenty:rose_quartz_cluster', [
        'biomesoplenty:large_rose_quartz_bud',
        'biomesoplenty:large_rose_quartz_bud'
    ]);

    // ========================================================================
    // 三、Create 粉碎配方（水晶 → 碎块 / 红石）
    // ========================================================================

    // 3.1 大芽 → 3 + 50% = avg 3.5
    create.crushing([
        Item.of('biomesoplenty:rose_quartz_chunk', 3),
        CreateItem.of('biomesoplenty:rose_quartz_chunk', 0.5)
    ], 'biomesoplenty:large_rose_quartz_bud').processingTime(150);

    // 3.2 中芽 → 1 + 50% = avg 1.5
    create.crushing([
        Item.of('biomesoplenty:rose_quartz_chunk'),
        CreateItem.of('biomesoplenty:rose_quartz_chunk', 0.5)
    ], 'biomesoplenty:medium_rose_quartz_bud').processingTime(150);

    // 3.3 小芽 → 4 红石（未成熟晶体，含大量红石成分）
    create.crushing(Item.of('minecraft:redstone', 4), 'biomesoplenty:small_rose_quartz_bud')
        .processingTime(150);

    // 3.4 紫水晶块粉碎：替换原有的 3+50% 为 8+50%=avg 8.5
    //    与玫瑰石英簇的粉碎效率对齐
    event.remove({ id: 'create:crushing/amethyst_block' });
    create.crushing([
        Item.of('minecraft:amethyst_shard', 8),
        CreateItem.of('minecraft:amethyst_shard', 0.5)
    ], 'minecraft:amethyst_block').processingTime(150);

    create.crushing([
        Item.of('minecraft:amethyst_shard', 3),
        CreateItem.of('minecraft:amethyst_shard', 0.5)
    ], 'minecraft:large_amethyst_bud').processingTime(150);
    create.crushing([
        Item.of('minecraft:amethyst_shard'),
        CreateItem.of('minecraft:amethyst_shard', 0.5)
    ], 'minecraft:medium_amethyst_bud').processingTime(150);
	
    // ========================================================================
    // 四、玫瑰石英 ↔ Create 双向连通
    // ========================================================================

    // 4.1 正向：BOP 碎块 ≈ Create 玫瑰石英，直接砂纸打磨得抛光石英
    create.sandpaper_polishing(
        'create:polished_rose_quartz',
        'biomesoplenty:rose_quartz_chunk'
    );

    // 4.2 反向：Create 玫瑰石英/抛光石英 → 缠魂 → BOP 碎块
    create.haunting(
        'biomesoplenty:rose_quartz_chunk',
        'create:rose_quartz'
    );
    create.haunting(
        'biomesoplenty:rose_quartz_chunk',
        'create:polished_rose_quartz'
    );

});

// ============================================================================
// 七、玫瑰石英分级掉落（非精准时）
// ============================================================================
BlockEvents.broken('biomesoplenty:rose_quartz_cluster', function (event) {
    if (event.player.isCreative()) return;
    var held = event.player.getItemInHand('main_hand');
    if (held.hasEnchantment('minecraft:silk_touch')) return;
    event.cancel();
    var fortune = held.getEnchantmentLevel('minecraft:fortune') || 0;
    var count = 4 + Math.floor(Math.random() * 3) + fortune;
    event.block.popItem('biomesoplenty:rose_quartz_chunk', count);
});

BlockEvents.broken('biomesoplenty:large_rose_quartz_bud', function (event) {
    if (event.player.isCreative()) return;
    var held = event.player.getItemInHand('main_hand');
    if (held.hasEnchantment('minecraft:silk_touch')) return;
    event.cancel();
    var fortune = held.getEnchantmentLevel('minecraft:fortune') || 0;
    var count = 2 + Math.floor(Math.random() * 2) + fortune;
    if (count > 0) event.block.popItem('biomesoplenty:rose_quartz_chunk', count);
});

BlockEvents.broken('biomesoplenty:medium_rose_quartz_bud', function (event) {
    if (event.player.isCreative()) return;
    var held = event.player.getItemInHand('main_hand');
    if (held.hasEnchantment('minecraft:silk_touch')) return;
    event.cancel();
    var fortune = held.getEnchantmentLevel('minecraft:fortune') || 0;
    var count = 1 + Math.floor(Math.random() * 1) + fortune;
    if (count > 0) event.block.popItem('biomesoplenty:rose_quartz_chunk', count);
});

BlockEvents.broken('biomesoplenty:small_rose_quartz_bud', function (event) {
    if (event.player.isCreative()) return;
    var held = event.player.getItemInHand('main_hand');
    if (held.hasEnchantment('minecraft:silk_touch')) return;
    event.cancel();
    var fortune = held.getEnchantmentLevel('minecraft:fortune') || 0;
    var count = Math.floor(Math.random() * 2) + fortune;
    if (count > 0) event.block.popItem('biomesoplenty:rose_quartz_chunk', count);
});
