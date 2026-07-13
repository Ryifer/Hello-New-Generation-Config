// 注册序列合成所需的过渡物品
StartupEvents.registry('item', event => {
    // 重型装甲过渡物：直接复用 steelblock 的方块贴图
    event.create('incomplete_hard_steel').displayName('未完成的重型装甲').texture('s_a_b:block/steel_block');
    event.create('incomplete_steel_quenched').displayName('淬火钢坯').texture('s_a_b:block/steel_block');
});