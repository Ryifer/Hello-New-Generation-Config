// ============================================================================
// zs_crystal_growth.js — 水晶生长机制（玫瑰石英）
// ----------------------------------------------------------------------------
// 原作者: Ryifer 许可证: CC BY-NC 4.0
// 玫瑰石英块（rose_quartz_block）作为母岩，通过 randomTick 生长晶簇。
// 生长链：小芽 → 中芽 → 大芽 → 簇
// ============================================================================

BlockEvents.randomTick('biomesoplenty:rose_quartz_block', function (event) {

    var block = event.block;
    var level = event.level;
    if (level.isClientSide()) return;

    var growthChance = 0.1; // 10% 基础概率
    if (Math.random() > growthChance) return;

    // 六面方向
    var dirs = [
        [0, -1, 0], [0, 1, 0],  // 下、上
        [-1, 0, 0], [1, 0, 0],  // 西、东
        [0, 0, -1], [0, 0, 1]   // 北、南
    ];

    // 随机打乱方向顺序
    for (var i = dirs.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var tmp = dirs[i]; dirs[i] = dirs[j]; dirs[j] = tmp;
    }

    for (var d = 0; d < dirs.length; d++) {
        var target = block.offset(dirs[d][0], dirs[d][1], dirs[d][2]);
        var current = target.getId();

        // 空气 → 尝试生小芽
        if (current === 'minecraft:air') {// || current === 'minecraft:water') {
            target.set('biomesoplenty:small_rose_quartz_bud');
            return;
        }

        // 逐级升级
        var next = null;
        if (current === 'biomesoplenty:small_rose_quartz_bud' && Math.random() < 0.4) {
            target.set('biomesoplenty:medium_rose_quartz_bud');
            return;
        }
        else if (current === 'biomesoplenty:medium_rose_quartz_bud' && Math.random() < 0.3) {
            target.set('biomesoplenty:large_rose_quartz_bud');
            return;
        }
        else if (current === 'biomesoplenty:large_rose_quartz_bud' && Math.random() < 0.2) {
            target.set('biomesoplenty:rose_quartz_cluster');
            return;
        }
    }
});
