// ============================================================================
// zs_electronics.js — 电子工业体系：T1~T4 分级 + CC 电脑重做
// ----------------------------------------------------------------------------
// T1: 基础电气（CA + IE 线/杆/连接器）— 默认配方，不调整
// T2: 逻辑元件（CPG 分立元件 → 动力合成）
// T3: 集成逻辑（CPG 电路板 + IE 电子组件）— 默认配方，不调整
// T4: 微电子（CPG IC）— 增加 T2 依赖
// CC: 电脑重做（安山/黄铜 + 电子组件/电路板 + 显示器）
// ============================================================================

ServerEvents.recipes(function (event) {

    var create = event.recipes.create;

    // ========================================================================
    // 一、T2 升级：手动合成 → 动力合成（原样材料，精密加工）
    // ========================================================================

    // 1.1 电阻
    event.remove({ id: 'powergrid:crafting/resistor' });
    create.mechanical_crafting('powergrid:resistor', [
        'R',
        'C',
        'W'
    ], { R: 'powergrid:resistive_coil', C: 'minecraft:coal', W: '#c:wires/copper' });

    // 1.7 压敏电阻
    event.remove({ id: 'powergrid:crafting/varistor' });
    create.mechanical_crafting('powergrid:varistor', [
        ' R ',
        'DCD',
        ' W '
    ], { R: 'powergrid:resistive_coil', C: 'minecraft:coal', D: 'minecraft:redstone', W: '#c:wires/copper' });

    // 1.2 IC级小电容
    event.remove({ id: 'powergrid:crafting/capacitor' });
    create.mechanical_crafting('powergrid:capacitor', [
        'IPI',
        ' W '
    ], { I: '#c:plates/iron', P: 'minecraft:paper', W: '#c:wires/copper' });

    // 1.3 二极管
    event.remove({ id: 'powergrid:crafting/diode' });
    create.mechanical_crafting('powergrid:diode', [
        'Q',
        'W'
    ], { Q: 'create:polished_rose_quartz', W: '#c:wires/copper' });

    // 1.4 VFet
    event.remove({ id: 'powergrid:crafting/vfet' });
    create.mechanical_crafting('powergrid:vfet', [
        'Q',
        'I',
        'W'
    ], { Q: 'create:polished_rose_quartz', I: '#c:plates/iron', W: '#c:wires/gold' });
	// bjt使用序列组装

    // 1.5 稳压管
    event.remove({ id: 'powergrid:crafting/regulator_tube' });
    create.mechanical_crafting('powergrid:regulator_tube', [
        'A',
        'I',
        'W'
    ], { A: 'minecraft:amethyst_shard', I: '#c:plates/iron', W: '#c:wires/copper' });

    // 1.6 稳流管
    event.remove({ id: 'powergrid:crafting/barretter_tube' });
    create.mechanical_crafting('powergrid:barretter_tube', [
        'Q',
        'I',
        'W'
    ], { Q: 'minecraft:quartz', I: '#c:plates/iron', W: '#c:wires/copper' });

    // 1.9 氖泡
    event.remove({ id: 'powergrid:crafting/neon_bulb' });
    create.mechanical_crafting('powergrid:neon_bulb', [
        'G',
        'I',
        'W'
    ], { G: 'minecraft:glowstone_dust', I: '#c:plates/iron', W: '#c:wires/copper' });

    // 1.8 电位器
    event.remove({ id: 'powergrid:crafting/potentiometer' });
    create.mechanical_crafting('powergrid:potentiometer', [
        ' A ',
        'WCW'
    ], { A: 'create:andesite_alloy', C: 'minecraft:coal', W: '#c:wires/copper' });

    // 1.8 继电器
    event.remove({ id: 'powergrid:crafting/relay' });
    create.mechanical_crafting('powergrid:relay', [
        'I',
        'A',
        'C'
    ], { A: 'create:andesite_alloy', I: '#c:plates/iron', C: 'powergrid:copper_coil'});
    // 1.9 继电器
    event.remove({ id: 'powergrid:crafting/relay_dpdt' });
    create.mechanical_crafting('powergrid:relay_dpdt', [
        'IAI',
        ' C '
    ], { A: 'create:andesite_alloy', I: '#c:plates/iron', C: 'powergrid:copper_coil'});

    // ========================================================================
    // 二、T4 微电子 → 增加 T1/T2 依赖
    // ========================================================================

    // 2.1 集成电路 base: 原配方 + 二极管 + VFet
    event.remove({ id: 'powergrid:mechanical/integrated_circuit' });
    create.mechanical_crafting('powergrid:integrated_circuit', [
        '  LL  ',
        'RQQQQR',
        ' GGGG '
    ], {
        L: 'minecraft:lapis_lazuli',
		R: 'minecraft:redstone', Q: 'create:polished_rose_quartz',
        G: 'minecraft:gold_nugget'
    });

    // ========================================================================
    // 三、CC 显示器 — 动力合成版（使用 CPG CRT）
    // ========================================================================

    /*event.remove({ id: 'computercraft:monitor_normal' });
    create.mechanical_crafting('computercraft:monitor_normal', [
        'BCG'
    ], { B: 'create:andesite_casing', C: 'powergrid:crt', G: '#c:glass_panes' });

    event.remove({ id: 'computercraft:monitor_advanced' });
    create.mechanical_crafting('computercraft:monitor_advanced', [
        'BCG'
    ], { B: 'create:brass_casing', C: 'powergrid:crt', G: '#c:glass_panes' });

    // ========================================================================
    // 四、CC 电脑 — 分级重构
    // ========================================================================

    // 安山电脑（T1）：安山机壳 + IE 电子组件 + CC 普通显示器
    event.remove({ id: 'computercraft:computer_normal' });
    create.mechanical_crafting('computercraft:computer_normal', [
        ' E ',
        'BEM',
        ' E '
    ], {
        E: 'immersiveengineering:component_electronic_adv',
        M: 'computercraft:monitor_normal', B: 'create:andesite_casing'
    });

    // 黄铜电脑（T2）：黄铜机壳 + CPG 电路板 + CC 高级显示器
    event.remove({ id: 'computercraft:computer_advanced' });
    event.remove({ id: 'computercraft:computer_advanced_upgrade' });
    create.mechanical_crafting('computercraft:computer_advanced', [
        ' E ',
        'BEM',
        ' E '
    ], {
        E: 'powergrid:integrated_circuit',
        M: 'computercraft:monitor_advanced', B: 'create:brass_casing'
    });*/

});
