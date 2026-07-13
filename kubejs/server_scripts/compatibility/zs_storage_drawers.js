// ============================================================================
// zs_storage_drawers.js — Storage Drawers 框架方块合成（基于 FramedBlocks）
// ----------------------------------------------------------------------------
// 用 framedblocks:framed_cube / framed_slab 替换原木材/石头/板材，
// 为 SD 的 framed 系列（无配方）提供合成途径。
// ============================================================================

ServerEvents.recipes(function (event) {

    // ========================================================================
    // 框架装饰条（framed_trim）
    // 原版 trim：8 木板 + 4 木棍 → 4 trim
    // 框架版：8 framed_cube + 4 木棍 → 4 framed_trim
    // ========================================================================
    event.shaped('4x storagedrawers:framed_trim', [
        'F/F',
        '/F/',
        'F/F'
    ], { F: 'framedblocks:framed_cube', '/': '#c:rods/wooden' });

    // ========================================================================
    // 框架抽屉 — Full Drawers（用 framed_cube 替换 planks）
    // ========================================================================
    event.shaped('storagedrawers:framed_full_drawers_1', [
        'FFF',
        ' X ',
        'FFF'
    ], { F: 'framedblocks:framed_cube', X: '#c:chests/wooden' });

    event.shaped('2x storagedrawers:framed_full_drawers_2', [
        'FXF',
        'FFF',
        'FXF'
    ], { F: 'framedblocks:framed_cube', X: '#c:chests/wooden' });

    event.shaped('4x storagedrawers:framed_full_drawers_4', [
        'FXF',
        'FFF',
        'FXF'
    ], { F: 'framedblocks:framed_cube', X: '#c:chests/wooden' });

    // ========================================================================
    // 框架抽屉 — Half Drawers（用 framed_slab 替换 slab）
    // ========================================================================
    event.shaped('storagedrawers:framed_half_drawers_1', [
        'SSS',
        ' X ',
        'SSS'
    ], { S: 'framedblocks:framed_slab', X: '#c:chests/wooden' });

    event.shaped('2x storagedrawers:framed_half_drawers_2', [
        'SXS',
        'SSS',
        'SXS'
    ], { S: 'framedblocks:framed_slab', X: '#c:chests/wooden' });

    event.shaped('4x storagedrawers:framed_half_drawers_4', [
        'SXS',
        'SSS',
        'SXS'
    ], { S: 'framedblocks:framed_slab', X: '#c:chests/wooden' });

    // ========================================================================
    // 框架压缩抽屉 — Compacting Drawers（用 framed_cube 替换 stone）
    // ========================================================================
    event.shaped('storagedrawers:framed_compacting_drawers_2', [
        'FpF',
        'F#F',
        'FIF'
    ], { F: 'framedblocks:framed_cube', p: 'minecraft:piston', '#': '#storagedrawers:full_drawers', I: '#c:ingots/iron' });

    event.shaped('storagedrawers:framed_compacting_drawers_3', [
        'FFF',
        'p#p',
        'FIF'
    ], { F: 'framedblocks:framed_cube', p: 'minecraft:piston', '#': '#storagedrawers:full_drawers', I: '#c:ingots/iron' });

    event.shaped('storagedrawers:framed_compacting_half_drawers_2', [
        'FpF',
        'F#F',
        'FIF'
    ], { F: 'framedblocks:framed_cube', p: 'minecraft:piston', '#': '#storagedrawers:half_drawers', I: '#c:ingots/iron' });

    event.shaped('storagedrawers:framed_compacting_half_drawers_3', [
        'FFF',
        'p#p',
        'FIF'
    ], { F: 'framedblocks:framed_cube', p: 'minecraft:piston', '#': '#storagedrawers:half_drawers', I: '#c:ingots/iron' });

    // ========================================================================
    // 框架控制器 — Controller / Controller IO（用 framed_cube 替换 stone）
    // ========================================================================
    event.shaped('storagedrawers:framed_controller', [
        'FFF',
        'CXC',
        'FDF'
    ], { F: 'framedblocks:framed_cube', C: 'minecraft:comparator', X: '#storagedrawers:drawers', D: '#c:gems/diamond' });

    event.shaped('storagedrawers:framed_controller_io', [
        'FFF',
        'CXC',
        'FGF'
    ], { F: 'framedblocks:framed_cube', C: 'minecraft:comparator', X: '#storagedrawers:drawers', G: '#c:ingots/gold' });

});
