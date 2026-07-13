// ============================================================================
// 钢铁装甲方块（s_a_b 1.4.3）统一配方
// ----------------------------------------------------------------------------
// 设计原则（全脚本统一，不再混用多套规则）：
//   1. 基础色块 = 原钢铁块 ×8 + 染料 ×1 → 8 个
//   2. 复杂色块 = 原钢铁块 ×8 + 唯一标记物 ×1 → 8 个
//   3. 迷彩块   = 原钢铁块 ×8 + 环境物 ×1 → 8 个
//   4. 以上每条都同时提供三种途径：工作台(有序) / 动力合成器 / 混合搅拌
//   5. 去色：任意色块鼓风(splashing)一步还原回原钢铁基础块
//   6. 装饰件：统一切石机切割（字母牌由钢铁块，brass 系由黄铜块）
//   7. 四种钢铁基础块的生产链保持 mod 原设计，仅整理格式
//
// ID 说明：已解包 jar 对照 387 个 blockstates 全量校验。命名极不规则，
//   故用 resolve() 按四种写法探测真实 ID；不存在的变体（如 orangehardsteelblock
//   实际叫 s_a_b:orange、rainbow 仅 normal 存在）会自动跳过，绝不中断事件。
// ============================================================================
ServerEvents.recipes(function (event) {

    var QUALS = ['normal', 'light', 'double', 'hard'];

    // 各质量的“原始基础块”：合成输入 / 去色产物
    var BASE = {
        normal: 's_a_b:steelblock',
        light:  's_a_b:lightsteelblock',
        double: 's_a_b:doublesteelblock',
        hard:   's_a_b:hardsteelblock'
    };

    // 每个质量的两种内核写法（带 block / 不带 block），供 resolve 拼接
    var CORES = {
        normal: ['steelblock', 'steel'],
        light:  ['lightsteelblock', 'lightsteel'],
        double: ['doublesteelblock', 'doublesteel'],
        hard:   ['hardsteelblock', 'hardsteel']
    };

    // 不规则特例：token×质量 → 真实 ID（绕过 resolve 的常规拼接）
    var OVERRIDES = {
        orange: { hard: 's_a_b:orange' } // 橙色硬质块没叫 orangehardsteelblock
    };

    function exists(id) {
        try { return !!id && Item.exists(id); } catch (e) { return false; }
    }

    // 解析某 token×质量 在 mod 中真正存在的方块 ID；找不到返回 null。
    // 依次尝试：token+core(block) / token+core(noblock) / core(block)+token / core(noblock)+token
    function resolve(token, qual) {
        if (OVERRIDES[token] && OVERRIDES[token][qual] && exists(OVERRIDES[token][qual])) {
            return OVERRIDES[token][qual];
        }
        var forms = CORES[qual];
        var cands = [
            's_a_b:' + token + forms[0], 's_a_b:' + token + forms[1],
            's_a_b:' + forms[0] + token, 's_a_b:' + forms[1] + token
        ];
        for (var i = 0; i < cands.length; i++) {
            if (exists(cands[i])) { return cands[i]; }
        }
        return null;
    }

    // —— 统一上色：craftBase ×8 + mark ×1 → result ×8（工作台 + 动力 + 混合三途径），并登记去色还原 ——
    // washTarget：鼓风去色的产物（缺省＝craftBase）。复杂色合成料是母色块，但去色一步回到原钢铁。
    function colorize(resultId, craftBase, mark, washTarget) {
        if (!resultId || !exists(craftBase) || !exists(mark)) { return; }
        var wash = washTarget || craftBase;
        // 先移除 mod 自带的该色块旧配方，确保只剩下面这套统一配方（不影响切石机装饰，产物 ID 不同）
        event.remove({ output: resultId });
        // 途径一：工作台有序合成（3×3 围 8 基础块，中心标记物）
        event.shaped(Item.of(resultId, 8), ['BBB', 'BMB', 'BBB'], { B: craftBase, M: mark });
        // 途径二：动力合成器（同样图案，需要动力）
        event.recipes.create.mechanical_crafting(Item.of(resultId, 8), ['BBB', 'BMB', 'BBB'], { B: craftBase, M: mark });
        // 途径三：混合搅拌（8 基础块 + 1 标记物，加热）
        event.recipes.create.mixing(Item.of(resultId, 8), ['8x ' + craftBase, mark]).heated();
        // 去色还原：鼓风一步回到原钢铁基础块
        if (exists(wash)) { event.recipes.create.splashing(wash, resultId); }
    }


    // ========================================================================
    // 一、四种钢铁基础块的生产链（贴近现实冶金）
    //   mod 自带配方依赖整合包不存在的 tfmg:heavy_plate，已失效；此处用现有材料重建。
    //   工序映射：mixing=熔炼炼钢 / compacting=锻压叠轧 / pressing=轧制成型 /
    //            sequenced_assembly+deploying=表面渗碳→合金化产线。
    //   每块先 remove 旧产物，确保只剩这一套确定配方；煤(coal)作碳源，取代不合理的染料。
    // ========================================================================
    var heavy = 'kubejs:incomplete_hard_steel';

    // 1) 轻钢块（低碳钢）：8 铁锭 + 1 煤 熔炼加热
    if (exists('s_a_b:lightsteelblock')) {
        event.remove({ output: 's_a_b:lightsteelblock' });
        event.recipes.create.mixing('s_a_b:lightsteelblock', [
            '8x minecraft:iron_ingot', 'minecraft:coal'
        ]).heated();
    }

    // 2) 标准钢块（中碳装甲钢）：2 轻钢块 + 1 煤 渗碳致密化（锻压加热）
    if (exists('s_a_b:steelblock') && exists('s_a_b:lightsteelblock')) {
        event.remove({ output: 's_a_b:steelblock' });
        event.recipes.create.compacting('s_a_b:steelblock', [
            's_a_b:lightsteelblock', 's_a_b:lightsteelblock', 'minecraft:coal'
        ]).heated();
    }

    // 3) 复合装甲块（双层轧制装甲）：2 标准钢块 超热叠轧复合
    if (exists('s_a_b:doublesteelblock')) {
        event.remove({ output: 's_a_b:doublesteelblock' });
        event.recipes.create.compacting('s_a_b:doublesteelblock', [
            's_a_b:steelblock', 's_a_b:steelblock'
        ]).superheated();
    }

    // 4) 硬化钢块（表面硬化合金装甲）：超热渗碳前置 → 序列装配 微量稀金属→主合金→冲压
    if (exists('s_a_b:hardsteelblock')) {
        event.remove({ output: 's_a_b:hardsteelblock' });
        var billet = 'kubejs:incomplete_steel_quenched'; // 复用第一节闲置物：高温渗碳钢坯

        // 前置：钢块 + 煤 超热压制 = 高温渗碳成钢坯（superheated 表达“超级加热”）
        event.recipes.create.compacting(billet, ['s_a_b:steelblock', 'minecraft:coal']).superheated();

        // 序列装配：钢坯 → 微量稀有金属(鹦鹉螺壳) → 主合金(下界合金碎片) → 冲压成型
        event.recipes.create.sequenced_assembly(
            's_a_b:hardsteelblock', billet,
            [
                event.recipes.create.deploying(heavy, [billet, 'create:powdered_obsidian']),  // 微量稀有金属
                event.recipes.create.deploying(heavy, [heavy, 'minecraft:netherite_scrap']),  // 主合金
                event.recipes.create.pressing('s_a_b:hardsteelblock', heavy)                  // 冲压成型
            ],
            heavy, 1
        );
    }

    // ========================================================================
    // 二、额外基础块（贴近现实冶金，逻辑微调）
    // ========================================================================
    if (exists('s_a_b:sandbag')) {
        // 钢框 + 大量沙 锻压成沙袋墙
        event.recipes.create.compacting('s_a_b:sandbag', ['s_a_b:steelblock', '4x minecraft:sand']);
    }
    if (exists('s_a_b:copmositearmor')) {
        // 硬化钢 + 黑曜石（陶瓷面板）超热复合 = 复合装甲
        event.recipes.create.compacting('s_a_b:copmositearmor', ['s_a_b:hardsteelblock', 'minecraft:obsidian']).superheated();
    }
    if (exists('s_a_b:cardboard')) {
        // 多张纸压实成纸板（compacting 支持多输入；pressing 只接受 1 个输入）
        event.recipes.create.compacting('s_a_b:cardboard', ['8x minecraft:paper']);
        event.shapeless('s_a_b:cardboard', ['8x minecraft:paper']); // 保留手搓备份
    }
    if (exists('s_a_b:rustedsteelblock')) {
        // 钢块遇水氧化生锈（splashing = 喷淋锈蚀），更现实
        event.recipes.create.splashing('s_a_b:rustedsteelblock', 's_a_b:steelblock');
    }
    if (exists('s_a_b:nickelalloysteel')) {
        // 镍合金钢：钢 + 锌锭（包内无镍，锌作合金元素代表）熔炼加热
        event.recipes.create.mixing('s_a_b:nickelalloysteel', ['s_a_b:steelblock', 'create:zinc_ingot']).heated();
    }
    if (exists('s_a_b:profiledsheeting')) {
        // 钢块轧制出异型钢板
        event.recipes.create.pressing('s_a_b:profiledsheeting', 's_a_b:steelblock');
    }

    // ========================================================================
    // 三、基础色块（16 标准色）：原钢铁块 ×8 + 染料 ×1 → 8 个（三途径 + 去色）
    // ========================================================================
    var STD = {
        black: 'black_dye', red: 'red_dye', green: 'green_dye', blue: 'blue_dye',
        cyan: 'cyan_dye', brown: 'brown_dye', gray: 'gray_dye', lightgray: 'light_gray_dye',
        lightblue: 'light_blue_dye', magenta: 'magenta_dye', yellow: 'yellow_dye',
        pink: 'pink_dye', purple: 'purple_dye', orange: 'orange_dye', lime: 'lime_dye', white: 'white_dye'
    };
    for (var color in STD) {
        var dyeId = 'minecraft:' + STD[color];
        for (var qi = 0; qi < QUALS.length; qi++) {
            var q = QUALS[qi];
            colorize(resolve(color, q), BASE[q], dyeId); // 合成料=去色目标=原钢铁块
        }
    }

    // ========================================================================
    // 四、复杂色块（21 军事色）：母色块 ×8 + 唯一标记物 ×1 → 8 个（三途径），去色一步回原钢铁
    //   parent = 母色（标准色之一），合成时用其对应质量的色块；mark = 该变体专属唯一物。
    // ========================================================================
    var MILITARY = [
        { token: 'colored_29',      parent: 'green',     mark: 'minecraft:oak_leaves' },
        { token: 'colored_31',      parent: 'brown',     mark: 'minecraft:spruce_leaves' },
        { token: 'colored_32',      parent: 'gray',      mark: 'minecraft:birch_leaves' },
        { token: 'colored_33',      parent: 'black',     mark: 'minecraft:dark_oak_leaves' },
        { token: 'coloredparade',   parent: 'white',     mark: 'minecraft:white_banner' },
        { token: 'shipbottom',      parent: 'red',       mark: 'minecraft:copper_ingot' },
        { token: '_4bo',            parent: 'green',     mark: 'minecraft:moss_block' },
        { token: 'gelb',            parent: 'yellow',    mark: 'minecraft:sandstone' },
        { token: 'panzergrau',      parent: 'gray',      mark: 'minecraft:iron_ingot' },
        { token: 'rotbraun',        parent: 'brown',     mark: 'minecraft:red_dye' },
        { token: 'olive',           parent: 'green',     mark: 'minecraft:dried_kelp' },
        { token: 'macraggeblue',    parent: 'blue',      mark: 'minecraft:lapis_lazuli' },
        { token: 'colonial',        parent: 'lightgray', mark: 'minecraft:clay_ball' },
        { token: 'warden',          parent: 'cyan',      mark: 'minecraft:echo_shard' },
        { token: 'rainbow',         parent: 'pink',      mark: 'minecraft:nautilus_shell' },
        { token: 'hazard',          parent: 'yellow',    mark: 'minecraft:black_dye' },
        { token: 'slate',           parent: 'gray',      mark: 'minecraft:cobbled_deepslate' },
        { token: 'brightred',       parent: 'red',       mark: 'minecraft:glowstone_dust' },
        { token: 'amt_7',           parent: 'lightblue', mark: 'minecraft:prismarine_crystals' },
        { token: 'luftwaffeyellow', parent: 'yellow',    mark: 'minecraft:glowstone' },
        { token: 'usagrey',         parent: 'lightgray', mark: 'minecraft:gunpowder' }
    ];
    for (var mi = 0; mi < MILITARY.length; mi++) {
        var sp = MILITARY[mi];
        for (var mqi = 0; mqi < QUALS.length; mqi++) {
            var mq = QUALS[mqi];
            // 合成料 = 母色块（该质量）；去色目标 = 原钢铁块（该质量）
            colorize(resolve(sp.token, mq), resolve(sp.parent, mq), sp.mark, BASE[mq]);
        }
    }

    // ========================================================================
    // 五、迷彩块（24 种）：原钢铁块 ×8 + 环境物 ×1 → 8 个（三途径），去色一步回原钢铁
    //   每个迷彩用唯一环境物，避免无序/动力合成撞配方。
    // ========================================================================
    var CAMO = {
        camoplains: 'short_grass', camoforest: 'oak_leaves', camosnow: 'snow_block',
        camodesert: 'sand', camomesa: 'terracotta', camoswamp: 'lily_pad',
        camotaiga: 'spruce_leaves', camojungle: 'jungle_leaves', camoreddesert: 'red_sand',
        camosky: 'blue_ice', lightsky: 'ice', grass: 'grass_block', dirt: 'dirt',
        grasstaiga: 'fern', podzol: 'podzol', grasssvanna: 'acacia_sapling',
        grassswamp: 'vine', grassjungle: 'jungle_sapling', grasssnowy: 'snowball',
        stone: 'cobblestone', grassbadlands: 'dead_bush', mycelium: 'red_mushroom',
        deepslate: 'deepslate', spruceleaves: 'spruce_sapling'
    };
    for (var cm in CAMO) {
        var camoMark = 'minecraft:' + CAMO[cm];
        for (var cqi = 0; cqi < QUALS.length; cqi++) {
            var cq = QUALS[cqi];
            colorize(resolve(cm, cq), BASE[cq], camoMark); // 合成料=去色目标=原钢铁块
        }
    }

    // ========================================================================
    // 六、装饰件（字母 / 数字 / 符号 / 军徽）：统一切石机切割
    //   钢铁系（DECO_STEEL）由 steelblock 切；黄铜系（DECO_BRASS）由 create:brass_block 切。
    //   逐个 exists() 守卫，不存在的跳过。
    // ========================================================================
    // 占位：装饰件数据表与切割循环在下方追加
    var DECO_STEEL = [   // 71 项，由 steelblock 切
        'b', 'bb', 'bundeswehrcross', 'c', 'cc', 'ch', 'colonialsign', 'comma', 'd', 'dd',
        'dot', 'doubledot', 'e', 'eight', 'equality', 'exclamation', 'f', 'femboysign', 'ff', 'five',
        'four', 'g', 'gg', 'h', 'i', 'ii', 'j', 'k', 'l', 'll',
        'm', 'minus', 'myag', 'n', 'nine', 'o', 'one', 'p', 'plus', 'pp',
        'puritysealduo', 'puritysealsolo', 'puritysealtrio', 'q', 'question', 'r', 'redstar', 's', 'seven', 'sh',
        'sha', 'six', 't', 'three', 'tverd', 'two', 'u', 'ultramar', 'uu', 'v',
        'w', 'whitestar', 'x', 'y', 'ya', 'yi', 'yu', 'z', 'zero', 'zh',
        'zz'
    ];
    var DECO_BRASS = [   // 65 项，由 create:brass_block 切
        'brass_0', 'brass_1', 'brass_2', 'brass_3', 'brass_4', 'brass_5', 'brass_6', 'brass_7', 'brass_8', 'brass_9',
        'brassa', 'brassae', 'brassb', 'brassbb', 'brassc', 'brasscc', 'brassch', 'brasscomma', 'brassd', 'brassdd',
        'brassdot', 'brassdoubledot', 'brasse', 'brassequality', 'brassexclamation', 'brassf', 'brassff', 'brassg', 'brassgg', 'brassh',
        'brassi', 'brassii', 'brassj', 'brassk', 'brassl', 'brassll', 'brassm', 'brassminus', 'brassmyagkii', 'brassn',
        'brasso', 'brassp', 'brassplus', 'brasspp', 'brassq', 'brassquestion', 'brassr', 'brasss', 'brasssh', 'brasssha',
        'brasst', 'brasstverdii', 'brassu', 'brassultramar', 'brassuu', 'brassv', 'brassw', 'brassx', 'brassy', 'brassya',
        'brassyi', 'brassyu', 'brassz', 'brasszh', 'brasszz'
    ];

    function cutDeco(list, source) {
        if (!exists(source)) { return; }
        for (var i = 0; i < list.length; i++) {
            var decoId = 's_a_b:' + list[i];
            if (!exists(decoId)) { continue; }
            event.remove({ output: decoId });           // 移除 mod 旧的板材切石机配方，统一改为块切割
            event.recipes.create.cutting(decoId, source);
        }
    }
    cutDeco(DECO_STEEL, 's_a_b:steelblock');
    cutDeco(DECO_BRASS, 'create:brass_block');

});

