// ============================================================================
// zs_fd_compat.js — Farmer's Delight 作物野化（非原产作物→野生变种）
// ----------------------------------------------------------------------------
// 原作者: Ryifer 许可证: CC BY-NC 4.0
// 马铃薯已由 Create 缠魂为毒马铃薯，番茄为烂番茄，本文件补第二步。
// ============================================================================

ServerEvents.recipes(function (event) {

    // create 简写
    var create = event.recipes.create;

    // ========================================================================
    // 一、FD 非原版作物野化
    // ========================================================================

    // 1.1 两步野化：毒马铃薯 → 缠魂 → 野生马铃薯
    create.haunting('farmersdelight:wild_potatoes', 'minecraft:poisonous_potato');

    // 1.2 两步野化：烂番茄 → 缠魂 → 野生番茄
    create.haunting('farmersdelight:wild_tomatoes', 'farmersdelight:rotten_tomato');

    // 1.3 一步野化：卷心菜 → 缠魂 → 野生卷心菜
    create.haunting('farmersdelight:wild_cabbages', 'farmersdelight:cabbage');

    // 1.4 一步野化：洋葱 → 缠魂 → 野生洋葱
    create.haunting('farmersdelight:wild_onions', 'farmersdelight:onion');

    // 1.5 一步野化：稻米 → 缠魂 → 野生稻米
    create.haunting('farmersdelight:wild_rice', 'farmersdelight:rice');
});
