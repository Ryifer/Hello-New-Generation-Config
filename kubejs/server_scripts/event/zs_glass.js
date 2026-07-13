// ============================================================================
// zs_glass.js — 玻璃体系统一（矿辞 / 粉碎 / 破坏掉落）
// ----------------------------------------------------------------------------
// 原作者: Ryifer 许可证: CC BY-NC 4.0
// 将 minecraft / chipped / yuushya / create 的玻璃统一接入 Quark 碎片体系。
// 零星模组的玻璃可能需要验证
// ============================================================================

// ========================================================================
// 一、标签定义：将所有模组玻璃加入 c 矿辞
// ========================================================================
ServerEvents.tags('block', function (event) {

    // 1.1 Create 木框窗户（无色，块+板）
    var CREATE_WINDOWS = [
        'oak', 'spruce', 'birch', 'jungle', 'acacia', 'dark_oak',
        'mangrove', 'cherry', 'bamboo', 'crimson', 'warped',
        'industrial_iron', 'ornate_iron', 'weathered_iron'
    ];
    CREATE_WINDOWS.forEach(function(w) {
        event.add('c:glass_blocks/colorless', 'create:' + w + '_window');
        event.add('c:glass_panes/colorless',  'create:' + w + '_window_pane');
    });

    // 1.2 IE 矿渣玻璃 → 脏玻璃
    event.add('c:glass_blocks/tinted', 'immersiveengineering:slag_glass');

    // 1.3 Yuushya 玻璃
    event.add('c:glass_blocks', 'yuushya:glasses');
    event.add('c:glass_blocks', 'yuushya:glass_rainshed');
    event.add('c:glass_blocks', 'yuushya:glass_showcase');

    // 1.4 Minecraft + chipped 的彩色玻璃 block
    //     chipped 已有全套色系 tag（chipped:glass、chipped:*_stained_glass），
    //     只需要将其映射到 c 矿辞即可。
    //     注意：chipped 的无色玻璃 tag = chipped:glass
    //           chipped 的染色玻璃 tag = chipped:<color>_stained_glass
    var COLORS = ['white','orange','magenta','light_blue','yellow','lime','pink',
                  'gray','light_gray','cyan','purple','blue','brown','green','red','black'];
    COLORS.forEach(function(c) {
        // chipped 已自带 per-blocks tag，这里映射到 c 色系用于配方
        event.add('c:glass_blocks/' + c, '#chipped:' + c + '_stained_glass');
        event.add('c:glass_panes/' + c,  '#chipped:' + c + '_stained_glass_pane');
    });

    // 1.5 无色玻璃 + tinted（原版 + chipped）
    event.add('c:glass_blocks/colorless', '#chipped:glass');
    event.add('c:glass_panes/colorless',  '#chipped:glass_pane');

    // 1.6 将有色玻璃统一加入 c:glass_blocks 父标签（用于破坏掉落通用匹配）
    COLORS.forEach(function(c) {
        event.add('c:glass_blocks', '#c:glass_blocks/' + c);
        event.add('c:glass_panes',  '#c:glass_panes/' + c);
    });
    event.add('c:glass_blocks', '#c:glass_blocks/colorless');
    event.add('c:glass_panes',  '#c:glass_panes/colorless');
    event.add('c:glass_blocks', '#c:glass_blocks/tinted');
});


// ========================================================================
// 二、Create 粉碎配方（矿辞驱动，自动覆盖全模组）
// ========================================================================
ServerEvents.recipes(function (event) {

    var create = event.recipes.create;

    function glassCrush(output, count, input, time) {
        create.crushing(Item.of(output, count), input).processingTime(time || 200);
    }

    // 2.1 原版无色玻璃
    glassCrush('quark:clear_shard', 4, 'minecraft:glass');
    glassCrush('quark:clear_shard', 2, 'minecraft:glass_pane');
    glassCrush('quark:dirty_shard',  2, 'minecraft:tinted_glass');

    // 2.2 染色玻璃枚举（手动指定确保 Create 配方兼容）
    var GLASS_BLOCKS = [
        ['white', 'white'], ['orange', 'orange'], ['magenta', 'magenta'],
        ['light_blue', 'light_blue'], ['yellow', 'yellow'], ['lime', 'lime'],
        ['pink', 'pink'], ['gray', 'gray'], ['light_gray', 'light_gray'],
        ['cyan', 'cyan'], ['purple', 'purple'], ['blue', 'blue'],
        ['brown', 'brown'], ['green', 'green'], ['red', 'red'], ['black', 'black']
    ];
    GLASS_BLOCKS.forEach(function(pair) {
        var color = pair[0];
        var shard = 'quark:' + color + '_shard';
        glassCrush(shard, 4, 'minecraft:' + color + '_stained_glass');
        glassCrush(shard, 2, 'minecraft:' + color + '_stained_glass_pane');
    });

    // 2.3 Create 木框窗户
    var CREATE_WINS = ['oak','spruce','birch','jungle','acacia','dark_oak',
                       'mangrove','cherry','bamboo','crimson','warped'];
    CREATE_WINS.forEach(function(w) {
        glassCrush('quark:clear_shard', 3, 'create:' + w + '_window');
        glassCrush('quark:clear_shard', 2, 'create:' + w + '_window_pane');
    });
    // 铁框窗户（出 dirty_shard 代表铁杂质）
    var IRON_WINS = ['industrial_iron', 'ornate_iron', 'weathered_iron'];
    IRON_WINS.forEach(function(w) {
        glassCrush('quark:dirty_shard', 3, 'create:' + w + '_window');
        glassCrush('quark:dirty_shard', 2, 'create:' + w + '_window_pane');
    });

    // 2.4 IE 矿渣玻璃
    glassCrush('quark:dirty_shard', 4, 'immersiveengineering:slag_glass');

    // 2.5 chipped 无色玻璃（通过 tag 批量）
    glassCrush('quark:clear_shard', 4, { tag: 'chipped:glass' });
    glassCrush('quark:clear_shard', 2, { tag: 'chipped:glass_pane' });

    // 2.6 chipped 染色玻璃（16 色）
    var CHIPPED_COLORS = ['white','orange','magenta','light_blue','yellow','lime',
                          'pink','gray','light_gray','cyan','purple','blue',
                          'brown','green','red','black'];
    CHIPPED_COLORS.forEach(function(c) {
        var shard = 'quark:' + c + '_shard';
        glassCrush(shard, 4, { tag: 'chipped:' + c + '_stained_glass' });
        glassCrush(shard, 2, { tag: 'chipped:' + c + '_stained_glass_pane' });
    });
});


// ========================================================================
// 三、破坏掉落（替代原版掉落，仅非精准时）
// ========================================================================
BlockEvents.broken(function (event) {

    var block = event.block;
    if (event.player.isCreative()) return;
    var held = event.player.getItemInHand('main_hand');
    var ench = held.getEnchantments();
    if (String(ench).indexOf('silk_touch') >= 0) return;
    if (!block.hasTag('c:glass_blocks') && !block.hasTag('c:glass_panes')) return;

    // 解析颜色（在方块消失前）
    var isPane = block.hasTag('c:glass_panes');
    var shardMap = {
        white: 'quark:white_shard', orange: 'quark:orange_shard',
        magenta: 'quark:magenta_shard', light_blue: 'quark:light_blue_shard',
        yellow: 'quark:yellow_shard', lime: 'quark:lime_shard',
        pink: 'quark:pink_shard', gray: 'quark:gray_shard',
        light_gray: 'quark:light_gray_shard', cyan: 'quark:cyan_shard',
        purple: 'quark:purple_shard', blue: 'quark:blue_shard',
        brown: 'quark:brown_shard', green: 'quark:green_shard',
        red: 'quark:red_shard', black: 'quark:black_shard'
    };
    var foundColor = null;
    for (var c in shardMap) {
        if (block.hasTag('c:glass_blocks/' + c) || block.hasTag('c:glass_panes/' + c)) {
            foundColor = shardMap[c];
            break;
        }
    }
    if (!foundColor && (block.hasTag('c:glass_blocks/colorless') || block.hasTag('c:glass_panes/colorless')))
        foundColor = 'quark:clear_shard';
    if (!foundColor && (block.hasTag('c:glass_blocks/tinted') || block.hasTag('c:glass_panes/tinted')))
        foundColor = 'quark:dirty_shard';
    if (!foundColor)
        foundColor = 'quark:clear_shard';

    var count = isPane ? (2 + Math.floor(Math.random() * 3)) : (3 + Math.floor(Math.random() * 2));

    block.popItem(Item.of(foundColor, count));
    block.set('minecraft:air');
	event.cancel();
});
